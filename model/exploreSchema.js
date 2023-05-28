const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

const Explore = mongoose.model('explores',expSchema);

module.exports = Explore;
