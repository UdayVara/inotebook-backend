const mongoose=require('mongoose')

const notesSchema=mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        require:true
    },
    tags:{
        type:String,
        
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("Note",notesSchema)