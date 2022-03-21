/*
============================================
; Title:        app.js
; Author:       David Rachwalik
; Date:         2022/03/20
; Description:  Basic setup for WEB-420 projects
;===========================================
*/

const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');

// --- Application Setup Steps ---

// Initialize Express app server
let app = express();
// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Setup OpenAPI/Swagger document library specification
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

// Start the Node server
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), () => {
  console.log(`Application started and listening on port ${app.get('port')}!`);
});

// --- Run Commands ---
// cd E:\Repos\web-420
// node app.js
// * navigate to http://localhost:3000/api-docs or enter the command: curl -i http://localhost:3000/api-docs
