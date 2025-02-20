require('./config/database');
const express = require('express');
const PORT = process.env.PORT || 2020;
const userRouter = require('./router/userRouter');
const postRouter = require('./router/postRouter')


const app = express();
app.use(express.json());
app.use('/api', userRouter)
app.use('/api', postRouter)

app.listen(PORT, ()=>{
  console.log(`Server is running on port: ${PORT}`)
});