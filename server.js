
const express = require('express')
const app = express()
const config = require('./config')
const bodyParser = require('body-parser');
const router = require('./routes')
// const request_logger = require('./utils/request-logger')()
// const logger = require('./utils/logger')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 4000; 

var mongoose   = require('mongoose');

var env = process.env.NODE_ENV || 'development'
var dbconfig = config[env].db;
if(dbconfig.name && dbconfig.host ) {
    var auth = ''
    if(dbconfig.usernmae && dbconfig.usernmae) {
        auth =  dbconfig.usernmae || '' +':'+dbconfig.password+'@'
    }
    var connectionString = 'mongodb://'+auth+dbconfig.host+':'+dbconfig.port+'/'+dbconfig.name
    mongoose.connect(connectionString)
} else {
    if(dbconfig.name) {
        console.log('Enter valid db name')
    } 
    if(dbconfig.host) {
        console.log('Enter valid hostname')
    }
}


app.use('/api', router);

//app.use(request_logger(logger))

app.listen(port);
console.log('Winter is coming here: ' + port);