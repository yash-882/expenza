import express from 'express';

// global error handler
import GlobalErrorHandler from './errors/global-err-handler.js';

// routers
import authRouter from './routes/auth-route.js';
import transactionRouter from './routes/transaction-route.js';
import settingRouter from './routes/setting-route.js';

// controllers
import authController from './controllers/auth-controller.js';
import settingController from './controllers/setting-controller.js';

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

// middleware for protecting routes defined below
app.use(authController.protect)

//checks if 30 days have passed since the budget was set
app.use(settingController.resetBudget)

app.use('/api/transaction', transactionRouter);
app.use('/api/user/setting', settingRouter);

// global error handler
app.use(GlobalErrorHandler)

export default app;