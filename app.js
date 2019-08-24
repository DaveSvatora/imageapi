const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const testFolder = './uploads/';
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

//multer
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: storage })

//cors
// const whitelist = ['http://192.168.1.2:3000','http://192.168.1.2:8080','http://localhost:8080'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

// ROUTES
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/all', function (req, res) {
  const filenames = [];
  fs.readdirSync(testFolder).forEach(file => {
    console.log(file);
    filenames.push({
      "file": file,
      "url": "http://192.168.1.2:3000/image/" + file
    });
  });
  res.json(JSON.stringify(filenames));
});

app.get("/image/:image", (req, res) => {
  console.log(req.params.image);
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
  res.send(files)
});

app.listen(3000, function () {
  console.log("Working on port 3000");
});