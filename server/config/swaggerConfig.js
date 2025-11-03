const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EscapeRoom API',
      version: '1.0.0',
      description: 'API para gestionar un sistema de escape rooms',
    },
    servers: [
      {
        url: 'http://localhost:3000/', 
      },
    ],
  },
  apis: ['./server/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;