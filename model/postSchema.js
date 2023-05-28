const mongoose=require('mongoose');
// const mongoose_fuzzy_searching=require('mongoose-fuzzy-search')

const postSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    postid:{
        type:String,
        required:true
    },
    context:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    postdate:{
        type:Date,
        default:Date.now,
        required:true
    },
    comment:[{
        username:{
            type:String,
            required:true
        },
        body:{
            type:String,
            required:true
        }
    }],

    likes:[{
        username:{
            type:String,
            required:true
        }
    }]

})


const Post = mongoose.model('posts',postSchema);

module.exports = Post;