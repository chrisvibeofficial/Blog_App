require('./config/database');
const express = require('express');
const PORT = process.env.PORT || 2020;
const userRouter = require('./router/userRouter');


const app = express();
app.use(express.json());
app.use('/api', userRouter)

app.listen(PORT, ()=>{
  console.log(`Server is running on port: ${PORT}`)
});