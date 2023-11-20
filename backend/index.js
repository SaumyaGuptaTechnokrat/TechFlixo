
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var route = require('./Router/router.js');
var port = 3001;
var app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(route);


var url = 'mongodb://127.0.0.1:27017/Employee';

mongoose.connect(url,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then((success)=>{
    console.log("Connected to mongoDB");
    app.listen(port,()=>{
        console.log("Server Started at " + port);
    });
}).catch((error)=>{
    console.log(error.message);
});



