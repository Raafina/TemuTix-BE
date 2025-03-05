import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';
const endpointsFiles = ['../routes/api.ts'];
const doc = {
  info: {
    version: 'v0.0.1',
    title: 'TemuTix BE Documentation',
    description: 'Documentation for Temutix BE',
  },
  servers: [
    { url: 'http://localhost:3009/api', description: 'Local Server' },
    {
      url: 'https://temutixapi.vercel.app/',
      description: 'Production Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      LoginRequest: {
        identifier: 'raafi',
        password: '12345',
      },
      RegisterRequest: {
        fullName: 'raafi',
        username: 'raafi',
        email: 'primeshokaku@gmail.com',
        password: '12345',
        confirmPassword: '12345',
      },
      ActivationRequest: {
        code: '12345',
      },
    },
  },
};

swaggerAutogen({
  openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
