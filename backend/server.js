import './configs/load-env.js';

import app from './app.js'
import mongoose from 'mongoose';

mongoose.connect(process.env.CONN_STR)
.then(()=> console.log('Connected to Expense Tracker DB'))
.catch((err)=> console.log(err))


app.listen(process.env.PORT, ()=> console.log('Listening to the PORT... '))

