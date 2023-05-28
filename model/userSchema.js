const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    postno:{
        type: Number,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    work:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    phone: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
    },
    password: {
        type: String,
        required: true
    },
    following: [
        {
            username: {
                type: String,
                required: true
            }
        }
    ],
    follower: [
        {
            username: {
                type: String,
                required: true
            }
        }
    ],
    userpost: [
        {
            postid: {
                type: String,
                required: true
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }

        }
    ]


})

//we are hashing the password 

userSchema.pre('save', async function (next) {

    if (this.isModified('email')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();

})


// we are generating token
userSchema.methods.updateFollower = async function (username) {

    try {
        let uname = username;
        console.log(uname);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token });
        // console.log("inside gentokenfunc")
        await this.save();
        return token;

    } catch (err) {
        console.log(err);
    }
}

userSchema.methods.addMessage = async function (name, email, phone, message) {
    try {
        this.messages = this.messages.concat({ name: name, email: email, phone: phone, message: message });
        await this.save();
        return this.messages;
    } catch (error) {
        console.log("error in add message function");
        console.log(error);
    }
}



const User = mongoose.model('users', userSchema);

module.exports = User;