/*
============================================
; Title:        app.js
; Author:       David Rachwalik
; Date:         2022/04/17
; Description:  Basic setup for WEB-420 projects
;===========================================
*/

const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const composerAPI = require('./routes/rachwalik-composer-routes');
const personAPI = require('./routes/rachwalik-person-routes');

// --- Database Setup Steps ---

// Build database connection string (https://www.urlencoder.org)
const database = 'web420DB';
// const conn = `mongodb+srv://buwebdev-cluster-1.gfevl.mongodb.net/${database}`;
const conn = `mongodb+srv://admin:admin@buwebdev-cluster-1.gfevl.mongodb.net/${database}?retryWrites=true&w=majority`;

// Establish connection to MongoDB
mongoose
  .connect(conn, {
    promiseLibrary: require('bluebird'),
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`MongoDB connection to '${database}' is successful!`);
  })
  .catch((err) => {
    console.log(`MongoDB Error: ${err.message}`);
  });

// --- Application Setup Steps ---

// Initialize Express app server
let app = express();

// Configure port & middleware
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure OpenAPI/Swagger document library specification
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WEB 420 RESTful APIs',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Files containing annotations for the OpenAPI Specification
};
const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Configure API routing middleware
app.use('/api', composerAPI);
app.use('/api', personAPI);

// Start the Node server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`Application started and listening on port ${app.get('port')}!`);
});

// --- Run Commands ---
// cd E:\Repos\web-420
// node app.js
// * navigate to http://localhost:3000/api-docs or enter the command: curl -i http://localhost:3000/api-docs
