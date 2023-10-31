const express = require('express')
var cors = require('cors')
const { connection } = require('mongoose')
const app = express()
const connectToMongo=require('./db')

// middleware to transfer Json data.
app.use(express.json())

// To bypass cors error while making api call
app.use(cors())


connectToMongo();
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use('/api/auth/',require('./routes/auth.js'))
app.use('/api/notes/',require('./routes/notes.js'))


app.listen(port, () => {
  console.log(`iNotebook backend app is listening on port ${port}`)
})