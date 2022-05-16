/*
============================================
; Title:        app.js
; Author:       David Rachwalik
; Date:         2022/05/15
; Description:  Node.js server for WEB-420 Capstone site
;===========================================
*/

const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
// routes
const teamAPI = require('./routes/team-routes');

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
      title: 'WEB-420 Capstone API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Files containing annotations for the OpenAPI Specification
};
const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Configure API routing middleware
app.use('/api', teamAPI);

// Automatically redirect to API page
app.get('/', (request, response) => {
  response.redirect('/api-docs');
});

// Start the Node server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`Application started and listening on port ${app.get('port')}!`);
});

// --- Run Commands ---
// cd E:\Repos\web-420\capstone
// node app.js
// * navigate to http://localhost:3000/api-docs or enter the command: curl -i http://localhost:3000/api-docs

// --- Create Heroku App Commands ---
// cd E:\Repos\web-420\capstone
// heroku login
// heroku create
// heroku apps:rename <yourLastName>‐capstone -–app <random‐app‐name-from-create>
// git init
// heroku git:remote -a <yourLastName>-capstone
// git add .
// git commit -‐am "Initial Deployment"
// git push heroku master
// heroku ps:scale web=1
// heroku open
// heroku logs --tail

// --- Deploy Commands ---
// cd E:\Repos\web-420\capstone
// npm run deploy
