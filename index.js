const express = require('express')
const path = require('path')
const multer = require('multer')
const bodyParser = require('body-parser')
const fs = require('fs')
const resize = require('./resize')
const getAllFiles = require('./reader')
const app = express()
app.use(bodyParser.json())

let today = new Date()
let dd = String(today.getDate()).padStart(2, '0')
let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
let yyyy = today.getFullYear()
const dir = 'uploads'
const storageDir = path.join(dir, String(yyyy), String(mm), String(dd))

fs.mkdirSync(storageDir, { recursive: true })
// multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })

/*
  Test upload ui, could be removed later
*/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

/*
  Get a json map of all the pictures
*/
app.get('/all', function (req, res) {
  const data = getAllFiles()
  res.header('Access-Control-Allow-Origin', '*')
  res.json(JSON.stringify(data))
})

/*
  Get individual image resized to 400px by 400px
*/
app.get('/uploads/:year/:month/:day/:image', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.type('image/png')
  resize(path.join(__dirname, dir, req.params.year, req.params.month, req.params.day, req.params.image)).pipe(res)
})

/*
  Get individual image full sized
*/
app.get('/full/:year/:month/:day/:image', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.type('image/png')
  res.sendFile(path.join(__dirname, dir, req.params.year, req.params.month, req.params.day, req.params.image))
})

/*
  Upload multiple files
*/
app.post('/uploadmultiple', upload.array('pics'), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  res.header('Access-Control-Allow-Origin', '*')
  res.send(files)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})
