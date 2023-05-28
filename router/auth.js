const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate")
require('../db/conn');
const User = require('../model/userSchema')
const Collegemail =require('../model/collegeEmail')
const DB = process.env.DATABASE;


router.get('/', (req, res) => {
    res.send(`Hello world frm the router js ${DB}`);

})


router.post('/register', async (req, res) => {

    const { name, username, email, status,work, phone, dob, password, cpassword } = req.body;
    if (!(name && username && email && status &&work&& phone && password && cpassword)) {
        return res.status(420).json({ error: "Plz fill the form completely" });

    }
    const about="Hey I am user";
    const postno =0;
    try {
        const emailExit = await User.findOne({ email: email })
        const usernameExit = await User.findOne({ username: username })
        const collegeEmail = await Collegemail.findOne({email:email})
        if (emailExit) {
            return res.status(421).json({ error: "email already used" });
        }

        else if(!collegeEmail){
            return res.status(424).json({error : "Email outside of college"})
        }
        else if (usernameExit) {
            return res.status(422).json({ error: "username already used" });
        }
        else if (cpassword != password) {
            return res.status(423).json({ error: "Passord are not matching" });
        }
        else if(password.length<=7){
            return res.status(425).json({error:"Insufficient length of password"})
        }
        
        const user = new User({ name, username,postno, email,about, status, work,phone, dob, password });
        await user.save();

        return res.json({ message: "user registerd successfully" });

    } catch (error) {
        console.log(error)
    }

})

//login route



router.post('/signin', async (req, res) => {
    try {
        let token
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "plz fill the complete data" })
        }

        const userLogin = await User.findOne({ email: email });


        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                return res.status(400).json({ erro: "invalid credidential" })
            }

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 258920000),
                httpOnly: true
            });
            res.json({ message: "user logined successfully" });
        }
        else {
            return res.status(400).json({ error: "invalid credidential" })
        }

    } catch (error) {

    }
})




router.get('/authenticate', authenticate, (req, res) => {
    res.send(req.rootUser);
})

router.get('/logout',(req,res)=>{
    console.log("inside logout")
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("user logout")
})


module.exports = router;