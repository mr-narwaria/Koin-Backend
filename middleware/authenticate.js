const jwt = require("jsonwebtoken");
const User = require("../model/userSchema")
const express = require('express');
const app = express();
const cookies = require("cookie-parser");
app.use(cookies());

const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})



const Authenticate = async (req, res, next) => {
    try {
        var i=0;
        const s=req.rawHeaders;
        var b=true;
        for(;i<s.length&&b;){
            if(s[i].indexOf("jwtoken",0)!=-1){
                b=false;
            }
            else{
                i++;
            }
        }

        var start=s[i].indexOf("jwtoken",0);
      
        var end=0;
        if(!b){
            end=s[i].indexOf(";",start);
        }
        let t=s[i];
        var token;
        if(end==-1){
             token=t.slice(start+8);
        }
        else{
            token=t.slice(start+8,end);
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY) ;
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token ": token});
        if(!rootUser){throw new Error('user not found')};
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();

    }
    catch (err) {
        console.log("error inside authenticate");
        res.status(401).send({unauthorized : 'no token provided'});
    }

}




module.exports = Authenticate;