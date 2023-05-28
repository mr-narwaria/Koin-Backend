const mongoose = require('mongoose');

const collemail = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

const Collegemail = mongoose.model('college_emails',collemail);

module.exports = Collegemail;
