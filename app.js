const express = require('express')
const multer = require('multer')
const path = require('path')
const ejs = require('ejs')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

//init app
const app = express()

//const port = 3000;

// mongodb init

app.use(express.urlencoded({ extended: false }));

let db

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
 if (err) return console.log(err)

 db = client.db();
 app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));

})

//EJS fornt-end code

app.set('view engine', 'ejs');

//Public Folder

app.use(express.static('./public'));

//Set storage engine

const storage = multer.diskStorage({
 destination: './public/uploads/',
 filename: function (req, file, cb) {
  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
 }
});

//Init Upload
const upload = multer({
 storage: storage
}).fields([{ name: 'aadhaarFile', maxCount: 1 },
{ name: 'panFile', maxCount: 1 }]);


//Routes

app.get('/', function (req, res) { res.render('index.ejs') });



app.post('/Submit', upload, (req, res, next) => {

 const file = req.files
 if (!file) {
  const error = new Error('Please upload a file')
  error.httpStatusCode = 400
  return next(error)

 }

 const formData = { aadhaarCardName: req.body.aadhaarCardName, aadhaarCardNo: req.body.aadhaarCardNo, panNumber: req.body.panNumber, email: req.body.email, phone: req.body.phone, category: req.body.category, gender: req.body.gender, firmName: req.body.firmName, buisnessType: req.body.buisnessType, buisnessAddress: req.body.buisnessAddress, dateOfStart: req.body.dateOfStart, nature: req.body.nature, employees: req.body.employees, investment: req.body.investment, accountNo: req.body.accountNo, ifsc: req.body.ifsc };

 db.collection("uAadhaar").insertOne(formData, (err) => {
  if (err) return console.log(err)

  console.log('image saved to database')
 },
  res.send("Submission-Success")
 )


})