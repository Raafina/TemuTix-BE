import express from 'express';
import router from './routes/index';
import bodyParser from 'body-parser';
import db from './utils/database';
import docs from './docs/routes';
import cors from 'cors';
import errorMiddleware from './middlewares/error.middleware';

async function init() {
  try {
    const result = await db();
    console.log('Database status: ', result);
    const app = express();
    app.get('/', (req, res) => {
      res.status(200).json({
        message: 'Server is running',
        data: null,
      });
    });
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/api', router);

    // for swagger docs
    docs(app);

    app.use(errorMiddleware.serverRoute());
    app.use(errorMiddleware.serverError());

    const PORT = 3009;

    app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
