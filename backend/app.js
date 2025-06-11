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
import cors from 'cors';

// app
const app = express();

// allows API access only to specified domains
app.use(cors({
  origin: process.env.FRONTEND_DOMAIN, //only allow requests to thisspecific domain
  credentials: true //allows browsers to send credentials(cookie, auth headers, etc) in cross-origin requests
}))

// parse json data
app.use(express.json())

// parse cookies
app.use(cookieParser())

// tells express to use 'qs' package for parsing query strings instead of default parser
  app.set('query parser', (queryString) => {
    // 'queryString' is a raw string
    return qs.parse(queryString)
})

// trim URL
app.use((req, res, next) => {
  // trimming 
  try{
    // can throw error on malformed url (when it includes invalid '%' encoding, like ..%iihe)
    let url = decodeURIComponent(req.url).trim()
    req.url = url
  } catch(err){
    return res.status(400).json({status: 'fail', message: err.message})
  }

  next()
  
})

// authentication route(sign-up, login, change password, etc)
app.use('/api/auth', authRouter);

// middleware for protecting routes defined below
app.use(authController.protect)

//checks if 30 days have passed since the budget was set
app.use(settingController.resetBudget)

app.use('/api/transaction', transactionRouter);
app.use('/api/user/setting', settingRouter);

// Middleware executes when the URL path is not found
app.use((req, res, next) => {
  return res.status(404).json({
    status: 'fail',
    message: 'Requested Page is not found'
  }) 
})

// global error handler
app.use(GlobalErrorHandler)

export default app;