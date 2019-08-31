const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const testFolder = './uploads/';
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(bodyParser.json());

//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: storage })

// ROUTES
app.get('/', function (req, res) {
  res.sendFile(HTML_FILE);
});

app.get('/all', function (req, res) {
  const filenames = [];
  fs.readdirSync(testFolder).forEach(file => {
    console.log(file);
    filenames.push({
      "file": file,
      "url": "http://192.168.1.2:8080/image/" + file
    });
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.json(JSON.stringify(filenames));
});

app.get("/image/:image", (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.sendFile(__dirname + "/uploads/" + req.params.image);
});

//Uploading multiple files
app.post('/uploadmultiple', upload.array('pics'), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.send(files)
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
});