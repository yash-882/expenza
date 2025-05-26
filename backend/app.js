import express from 'express';
import authRouter from './routes/auth-route.js';
import GlobalErrorHandler from './errors/global-err-handler.js';

const app = express();

// parse json data
app.use(express.json())

// authentication route(sign-up, login, change password, etc)
app.use('/api/expenza/auth', authRouter);

// global error handler
app.use(GlobalErrorHandler)

export default app;