import express from 'express';

// custom modules
import GlobalErrorHandler from './errors/global-err-handler.js';

// routers
import authRouter from './routes/auth-route.js';
import transactionRouter from './routes/transaction-route.js';
import accountSettingRouter from './routes/account-setting.-route.js';

// third-party packages
import cookieParser from 'cookie-parser';
import qs from 'qs';
// app
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
app.use('/api/auth', authRouter);
app.use('/api/transaction', transactionRouter);

// global error handler
app.use(GlobalErrorHandler)

export default app;