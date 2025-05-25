dotenv.config({path:'./configs/file.env'})

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js'

mongoose.connect(process.env.CONN_STR)
.then(()=> console.log('Connected to Expense Tracker DB'))
.catch((err)=> console.log(err))


app.listen(process.env.PORT, ()=> console.log('Listening to the PORT... '))

