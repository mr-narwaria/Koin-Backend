require('../db/conn');
const Post= require('../model/postSchema')
const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { route } = require('./auth');
const User = require('../model/userSchema');

router.get('/getpost/:uname', async (req, res) => {
    try {
        const id=req.params.uname;
        const user=await User.findOne({username:id});
        if(!user){
            return res.status(404);
        }
        const postid=[];
        const post=[];
        var i=0;
        for(;i<user.userpost.length;i++){
            postid.push(user.userpost[i].postid);
        }
        i=0; for(;i<postid.length;i++){
            const p=await Post.findOne({postid:postid[i]});
            post.push(p);
        }
        req.use= post;
        res.send(req.use);
    } catch (err) {
        console.log(err)
    }
})
router.get('/getupost',authenticate, async (req, res) => {
    try {
        const user=req.rootUser;
        const postid=[];
        const post=[];
        var i=0;
        for(;i<user.userpost.length;i++){
            postid.push(user.userpost[i].postid);
        }
        i=0; for(;i<postid.length;i++){
            const p=await Post.findOne({postid:postid[i]});
            if(p!=null){
                post.push(p);
            }
        }
        req.use= post;
        res.send(req.use);
    } catch (err) {
        console.log(err)
    }
})



router.get('/post/:postid',async(req,res)=>{
    try {
        
        const postid=req.params.postid;
        const post= await Post.findOne({postid:postid});
        if(!post){
            return res.status(405)
        }
        req.post = post;
        res.send(req.post);
    } catch (error) {
        
    }
})

router.get('/getfeed',authenticate,async(req,res)=>{
    try {
        const user=req.rootUser;
        const postid=[];
        const post=[];
        var i=0;
        for(;i<user.userpost.length;i++){
            postid.push(user.userpost[i].postid);
        }
        i=0;
        for(;i<user.following.length;i++){
            const otuser=await User.findOne({username:user.following[i].username});
            var j=0;
            if(otuser){
                for(;j<otuser.userpost.length;j++){
                    postid.push(otuser.userpost[j].postid);
                }
            }
        }
        i=0;

        for(;i<postid.length;i++){

            const p=await Post.findOne({postid:postid[i]});
            post.push(p);
        }
        req.use= post;
        res.send(req.use);
    } catch (error) {
        console.log(error);
    }
})

router.post('/uploadpost',authenticate,async(req,res)=>{
    try {
        const user=req.rootUser;
        const n=user.postno+1;
        const name=user.name;
        const username=user.username;
        const postid=username+`-p-${n}`;
        const context=req.body.context;
        const body=req.body.body;

        if(!body||!context){
            console.log("fill form completely")
            return res.status(402).send({"erro":"fill form completely"});
        }
        const post=new Post({name,username,postid,context,body});
        await post.save();
        const us=await User.updateOne({username:username},{$push:{userpost:{postid:postid}},$inc:{postno:1}})
        const post1=await Post.findOne({postid:postid});
        req.post=post1;
        return res.status(200).send(req.post);

    } catch (error) {
        console.log(error);
        return res.status(492).send("not working");
        
    }
})

router.post('/deletepost',authenticate,async(req,res)=>{
    try {
        const username=req.rootUser.username;
        console.log(username)
        const postid=req.body.postid;
        console.log(postid)
        const a=await User.findOneAndUpdate({username:username},{$pull:{userpost:{postid:postid}}})
        const b=await Post.findOneAndDelete({postid:postid});
        if(a&&b){
            res.status(200).send("post deleted successfully")
        }
    } catch (error) {
        res.status(501).send("can't delete");
    }
})

router.post('/addcomment',authenticate,async(req,res)=>{
    try {
        const username=req.rootUser.username;
        const body=req.body.commBody;
        const postid=req.body.postid;
        const p={
            username:username,
            body:body
        }

        const pos= await Post.updateOne({postid:postid},{$push:{comment:p}},{new:true})
        if(body===""){
            return res.status(402)
        }
        else if(!pos){
            console.log("not working");
            return res.status(500);
        }
        const pos1=await Post.findOne({postid:postid});
        req.pos=pos1;
        res.status(200).send(req.pos);
        
    } catch (error) {
        console.log(error)
        res.status(500).send({work:"akkak"});
    }
})


router.post('/addlike',authenticate,async(req,res)=>{
    try {
        const username={username:req.rootUser.username};
        const postid=req.body.postid;
        const pid={postid:postid}
        const a= await Post.findOneAndUpdate(pid,{$push:{likes:username}});
        
        if(a){
            res.status(200).send({mess:"adding like"});
            console.log("iii")
        }
    } catch (error) {
        
    }
})

router.post('/removelike',authenticate,async(req,res)=>{
    try {
        const username={username:req.rootUser.username};
        const postid=req.body.postid;
        const pid={postid:postid}
        const a= await Post.updateOne(pid,{$pull:{likes:username}});
        if(a){
            res.status(200).send({mess:"removing likes"});
        }
    } catch (error) {
        
    }
})





module.exports = router;