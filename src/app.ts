import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './app/config';
import { userRoutes } from './app/modules/User/user.routes';

const app: Application = express();

// parsers
app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // for "Content-Type": "application/x-www-form-urlencoded" (ex: used in NextMert- reCaptchaTokenVerification action)

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: `${config.preffered_website_name}! server 🚑 💉 🩺  ✨  ⚡`,
  });
});

app.use('/api/v1/user', userRoutes);

export default app;
