const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const resize = require('./resize');

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(bodyParser.json());
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
const dir = 'uploads';
console.log(today);
fs.mkdirSync('uploads/' + today, { "recursive": true });
//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/' + today);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

// ROUTES
app.get('/', function (req, res) {
  res.sendFile(HTML_FILE);
});

app.get('/all', function (req, res) {

  const filenames = [];
  fs.readdirSync(dir).forEach(file => {
    // console.log(file);
    let stat = fs.statSync("" + dir + "/" + file);
    if (stat.isDirectory()) {
      console.log(dir + "/" + file);
      fs.readdirSync(dir + "/" + file).forEach(sub => {
        console.log("pushing: " + dir + "/" + file + "/"+ sub);
        filenames.push(
          {
            "file": file,
            "url": "http://192.168.1.2:8080/" + dir + "/" + file + "/"+ sub
          }
        );
      });
    }
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.json(JSON.stringify(filenames));
});

app.get("/uploads/:date/:image", (req, res) => {
  console.log(req.params.date + '/' + req.params.image);
  res.header('Access-Control-Allow-Origin', '*');
  res.type('image/png');
  resize(__dirname + "/uploads/" + req.params.date + '/' + req.params.image).pipe(res);
  // res.sendFile(__dirname + "/uploads/" + req.params.date + '/' + req.params.image);
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