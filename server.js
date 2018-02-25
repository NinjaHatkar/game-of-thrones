
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

var dbconfig = config.db;

if(dbconfig.name || dbconfig.host ) {
    mongoose.connect('mongodb://'+dbconfig.host+':'+dbconfig.port+'/'+config.db.name)
} else {
    if(dbconfig.name) {
        console.log()
    }
}


app.use('/api', router);

//app.use(request_logger(logger))

app.listen(port);
console.log('Winter is coming here: ' + port);