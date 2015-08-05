var express = require('express');
var multer = require('multer');
var app = express();
app.use(express.static('./'));
app.use(multer({ dest: './uploads/'}));

app.post('/upload', function(req, res) {
    var reqFiles = req.files;
    console.log('uploaded file', reqFiles.file.originalname);
    res.send(200);
});

app.listen(3000);