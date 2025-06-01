import express from 'express';
import authRouter from './routes/auth-route.js';
import GlobalErrorHandler from './errors/global-err-handler.js';
import cookieParser from 'cookie-parser';
import transactionRouter from './routes/transaction-route.js';

const app = express();

// parse json data
app.use(express.json())

// parse cookies
app.use(cookieParser())

// authentication route(sign-up, login, change password, etc)
app.use('/api/expenza/auth', authRouter);
app.use('/api/expenza/transaction', transactionRouter);

// global error handler
app.use(GlobalErrorHandler)

export default app;