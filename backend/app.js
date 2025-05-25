import express from 'express';

const app = express();

// parse json data
app.use(express.json())


export default app;