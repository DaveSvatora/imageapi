const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage }).array('pics');

//cors
const whitelist = ['http://localhost:8080'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  }
};

//Uploading multiple files
app.post('/uploadmultiple', cors(corsOptions), function (req, res) {
  console.log("inpost");
  upload(req, res, function (err) {
    // console.log(req.body);
    //console.log(req.files);
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
})

app.listen(3000, function () {
  console.log("Working on port 3000");
});