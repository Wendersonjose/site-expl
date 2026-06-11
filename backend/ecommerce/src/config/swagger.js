import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Configuração do Swagger/OpenAPI. As anotações @openapi ficam junto das
 * rotas de cada módulo (src/modules ** / *.routes.js).
 */
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Explosion E-commerce API',
      version: '1.0.0',
      description: 'API REST da loja Explosion (Node.js + Express + MySQL).',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js'],
});
