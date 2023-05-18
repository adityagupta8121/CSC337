/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 8; server.js

    File responsible to work as server in 
    web app chatty, implements server at port 3000.
*/
const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser');
const app = express();

const mbdUrl = "mongodb://127.0.0.1:27017/chatty";
const port = 3000;

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(express.static('public_html'));

var Schema = mongoose.Schema;
var ChatMessageSchema = new Schema({
  alias: String,
  message: String
});
var Data = mongoose.model('Data', ChatMessageSchema);

mongoose.connect(mbdUrl, {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'There was a problem connectibg to mongoDB'));
console.log('Connected to MongoDB!!')

/*
Gets/Prints from the dataBase
*/
app.get('/data', (req, res) => {
  Data.find({}).exec((err, results) => {
    if (err) { return res.end('Check Server app.get'); }
      var returnStr = '';
      for (i in results) {
        rs = results[i];
        returnStr += '<p><b style="font-weight: bold;">' + rs.alias + ':</b> ' + rs.message + '</p>\n'
      }
      res.end(returnStr);
    });
});

/*
Stores to the dataBase
*/
app.post('/create/data/:alias/:message', (req, res) => {
  msgList = req.params.message.split('+');
  msgStr = msgList.join(' ');
  var toStore = new Data({alias: req.params.alias, message: msgStr});
  toStore.save((err) => {
    if (err) res.end('Error in saving line 40+');
    res.end('data in DB');
  })
});

app.listen(port, () => {
  console.log('Server is running...');
});