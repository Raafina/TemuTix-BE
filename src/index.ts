import express from 'express';
import router from './routes/api';
import bodyParser from 'body-parser';
import db from './utils/database';

async function init() {
  try {
    const result = await db();
    console.log('Database status: ', result);
    const app = express();
    const PORT = 3000;

    app.use(bodyParser.json());
    app.use('/api', router);

    app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
