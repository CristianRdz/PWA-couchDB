const express = require('express')
const path = require('path')

const httpPort = 3000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.get('/api/data', (req, res) =>{
  res.json({message:"cristian"})
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`)
})

