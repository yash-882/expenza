import express from 'express';
import authRouter from './routes/auth-route.js';
import GlobalErrorHandler from './errors/global-err-handler.js';
import cookieParser from 'cookie-parser';
import transactionRouter from './routes/transaction-route.js';
import qs from 'qs';

const app = express();

// parse json data
app.use(express.json())

// parse cookies
app.use(cookieParser())

// tells express to use 'qs' package for parsing query strings instead of default parser
  app.set('query parser', (queryString) => {
    // 'queryString' is a raw string
    return qs.parse(queryString)
})

// authentication route(sign-up, login, change password, etc)
app.use('/api/expenza/auth', authRouter);
app.use('/api/expenza/transaction', transactionRouter);

// global error handler
app.use(GlobalErrorHandler)

export default app;