import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './app/config';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// parsers
app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // for "Content-Type": "application/x-www-form-urlencoded" (ex: used in NextMert- reCaptchaTokenVerification action)

// 🚑  💉  🩺  🏡  🚴 ✨  ⚡  💡  🧠  🔍  🧪  🧬  🧫
app.get('/', (req: Request, res: Response) => {
  res.send({
    message: `${config.preffered_website_name}! server 🚑  💉  🩺`,
  });
});

// all routes
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// not found route handler
app.use(notFound);
export default app;
