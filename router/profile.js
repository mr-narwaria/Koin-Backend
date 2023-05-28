require('../db/conn');
const User = require('../model/userSchema')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticate = require("../middleware/authenticate")
const Explore = require('../model/exploreSchema');

router.get('/getprofile/:uname', async (req, res) => {
    try {
        const uname = req.params.uname;
        const user = await User.findOne({ username: uname })
        return res.status(200).send(user);
    } catch (err) {
        res.status(401).send({ error: 'Not valid username' });
    }
})

router.post('/updateprofile', authenticate, async (req, res) => {
    try {
        const username = req.rootUser.username;
        const { status, work,about,phone } = req.body
        if (!(status &&work&& phone && about)) {
            return res.status(402).send({ message: "plzz fill every field" });
        }
        const u = await User.findOneAndUpdate({ username: username }, { $set: { status, work,about,phone} });
        if (u) {
            return res.status(200).send({ message: "user updated successfully" });
        }
        return res.status(500).send({ message: "can't update" })
    } catch (error) {
        return res.status(500).send({ message: "can't update" })
    }
})



router.post('/addfollower', authenticate, async (req, res) => {

    try {
        const usn1 = req.rootUser.username;
        const usn2 = req.body.username;
        const us1 = { username: usn1 };
        const us2 = { username: usn2 };
        const b = await User.findOneAndUpdate(us2, { $push: { follower: us1 } });
        const a = await User.findOneAndUpdate(us1, { $push: { following: us2 } });
        if (a && b) {
            res.status(200).send(b);
        }
    } catch (error) {
        res.status(401).send({ "erro": "This is error" })
    }

})


router.post('/removefollower', authenticate, async (req, res) => {
    try {
        const usn1 = req.rootUser.username;
        const usn2 = req.body.username;
        const us1 = { username: usn1 };
        const us2 = { username: usn2 };
        const a = await User.updateOne(us1, { $pull: { following: us2 } });
        const b = await User.updateOne(us2, { $pull: { follower: us1 } });
        if (a && b) {
            res.status(200).send(b);
        }
    } catch (error) {
        res.status(401).send({ "erro": "This is error" })

    }
})



router.get('/getfollowing/:uname', async (req, res) => {

    const id = req.params.uname;
    const userlist = [];
    const user = await User.findOne({ username: id });
    if (!user) {
        return res.status(404);
    }

    var i = 0;
    for (; i < user.following.length; i++) {

        const u = await User.findOne({ username: user.following[i].username });
        if (u) {

            userlist.push(u);
        }
    }

    req.userlist = userlist;
    return res.send(req.userlist);

})


router.get('/getfollower/:uname', async (req, res) => {
    const id = req.params.uname;
    const userlist = [];
    const user = await User.findOne({ username: id });
    if (!user) {
        return res.status(404);
    }
    var i = 0;
    for (; i < user.follower.length; i++) {
        const u = await User.findOne({ username: user.follower[i].username });
        if (u) {
            userlist.push(u);
        }
    }
    req.userlist = userlist;
    return res.send(req.userlist);
})

router.get('/ufollower', authenticate, async (req, res) => {
    const id = req.rootUser.username;
    const userlist = [];
    const user = await User.findOne({ username: id });
    if (!user) {
        return res.status(404);
    }
    var i = 0;
    for (; i < user.follower.length; i++) {
        const u = await User.findOne({ username: user.follower[i].username });
        if (u) {
            userlist.push(u);
        }
    }
    req.userlist = userlist;
    return res.send(req.userlist);
})


router.get('/ufollowing', authenticate, async (req, res) => {
    const id = req.rootUser.username;
    const userlist = [];
    const user = await User.findOne({ username: id });
    if (!user) {
        return res.status(404);
    }
    var i = 0;
    for (; i < user.following.length; i++) {
        const u = await User.findOne({ username: user.following[i].username });
        if (u) {
            userlist.push(u);
        }
    }
    req.userlist = userlist;
    return res.send(req.userlist);
})


router.get('/getexplore', async (req, res) => {
    const a = await Explore.find({});
    if (!a) {
        return res.status(404);
    }
    const exp = [];
    var i = 0;
    for (; i < a.length; i++) {
        const use = await User.findOne({ email: a[i].email });
        if (use) {
            exp.push(use);
        }
    }
    return res.send(exp);

})



router.post('/updatexplore', async (req, res) => {
    const email = req.body.email;
    const uep = new Explore({ email: email })
    await uep.save();
    res.send({ message: "updated successfully" });
})


router.get('/searchUser/:uname', async (req, res) => {
    const uname = req.params.uname
    const user = await User.findOne({ username: uname })
    if (user) {
        req.user = user;
        return res.status(200).send(req.user);
    }
    else {
        return res.status(404);
    }
})


router.post('/updatepass', authenticate,async (req, res) => {
    try {
        const user=req.rootUser;
        const userName={username:user.username};
        const { oldPass, newPass, conNewPass } = req.body;
        if (!(oldPass && newPass && conNewPass)) {
            return res.status(420).json({ error: "Plzz fill form completly" })
        }
        else if(!(newPass===conNewPass)){
            return res.status(423).json({error:"Password are not matching"})
        }

        const isMatch=await bcrypt.compare(oldPass,user.password);

        if(!isMatch){
            return res.status(403).json({error:"Old password is incorrect"});
        }
        if(newPass.length<8){
            return res.status(425).json({error:"Password must have atleast 8 character"})
        }
        const hashPass= await bcrypt.hash(newPass,12);
        const u=await User.findOneAndUpdate(userName,{$set:{password:hashPass}})

        if(u){
            return res.status(200).json({message:"password changed successfully"});
        }
        return res.status(500).json({error:"some error in database"});

    } catch (error) {

        return res.status(500).json({error:"some error in database"});
    }
})

module.exports = router;