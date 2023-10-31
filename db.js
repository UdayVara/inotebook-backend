const mongoose = require('mongoose')

const connectToMongo = () => { mongoose.connect('mongodb+srv://uday:uday4268@cluster0.ov7y3cz.mongodb.net/inotebook'
).then(()=>{console.log("connection established")}).catch(()=>{console.log("failed to connect")})};

module.exports = connectToMongo;