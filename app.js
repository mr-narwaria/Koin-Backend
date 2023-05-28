const mongoose= require('mongoose');
const express= require('express');
const app= express();
const dotenv=require('dotenv');
const authenticate=require('./middleware/authenticate')


dotenv.config({path:'./config.env'})

const PORT= process.env.PORT;

require('./db/conn');
// const User=require('./model/userSchema');

app.use(express.json());

//****  ROUTING FILES *****
app.use(require('./router/auth'));
app.use(require('./router/profile'));
app.use(require('./router/post'));



app.get('/login',(req,res)=>{
    res.send('login page');
    
})

app.get('/signup',(req,res)=>{
    res.send('signup page');
    
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})









//Middleware
// const middleware = (req,res,next) =>{
//     next();
// }



// app.get('/',(req,res)=>{
//     res.send('Hello world frm the server');

// })



// app.get('/about',middleware,(req,res)=>{
//     res.cookie("test",{name:"akkk"});
//     res.send('About page');

// })


// contact page
// app.get('/contact',authenticate, async(req,res)=>{
    
// })