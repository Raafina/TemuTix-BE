import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';

const endpointsFiles = ['./src/routes/index.ts'];

const doc = {
  info: {
    version: 'v0.0.1',
    title: 'TemuTix BE Documentation',
    description: 'Documentation for Temutix BE',
  },
  servers: [
    { url: 'http://localhost:3009/api', description: 'Local Server' },
    {
      url: 'https://temutixapi.vercel.app/api',
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
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: 3273,
          coordinates: [0, 0],
          address: "",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      CreateTicketRequest: {
        price: 1500,
        name: "Ticket Reguler",
        events: "6762aa5dacb76a9b3e2cb1da",
        description: "Ticket Reguler - Description",
        quantity: 100,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateBannerRequest: {
        title: "Banner 3 - Title",
        image:
          "https://res.cloudinary.com/raafina/image/upload/v1752488426/Rineko_wzaxxy.png",
        isShow: false,
      },
    },

  },
};

swaggerAutogen({
  openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
