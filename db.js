const mongoose = require('mongoose')

const connectToMongo = () => {mongoose.connect('mongodb://localhost:27017/inotebook',
  {
    useUnifiedTopology: true
  }
)};

module.exports = connectToMongo;