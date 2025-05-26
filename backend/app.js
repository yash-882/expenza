import express from 'express';

import GlobalErrorHandler from './errors/global-err-handler.js';

const app = express();

// parse json data
app.use(express.json())


// global error handler
app.use(GlobalErrorHandler)

export default app;