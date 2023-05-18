/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 9; server.js

    File responsible to work as server in 
    Ostaa chatty, implements server at port 3000.
*/
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const app = express();

const mbdUrl = 'mongodb://127.0.0.1/ostaa';
const port = 3000;

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(express.static('public_html'));

//connects to server
mongoose.connect(mbdUrl, {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'There was a problem connecting to mongoDB'));
console.log('Connected to MongoDB!!')

//setting up database schema
var Schema = mongoose.Schema;

//schema for users
var UserSchema = new Schema({
    listings: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Item' }], 
    username: String,
    password: String
});
var User = mongoose.model('User', UserSchema);

//schema for items
var ItemSchema = new Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String,
    user: String
});
var Item = mongoose.model('Item', ItemSchema);


/*
implementing POST/GET requests

/get/users/ returns a JSON array containing the information for every user in the database
/get/items/ returns a JSON array containing the information for every item in the database
/get/listings/USERNAME returns a JSON array containing every listing by USERNAME.
/get/purchases/USERNAME returns a JSON array containing every purchases by USERNAME.
/search/users/KEYWORD returns a JSON list of every user whose username substring of KW
/search/items/KEYWORD returns a JSON list of every item whose username substring of KW
/add/user/ adds user to DB
/add/item/USERNAME adds item to DB
*/
app.get('/get/users', (req, res) => {
    var user = mongoose.model('User', UserSchema);
    user.find({}).exec(function(error, results) {
        res.end(JSON.stringify(results, null, 2));
    })
});

app.get('/get/items', (req, res) => {
    var item = mongoose.model('Item', ItemSchema);
    item.find({}).exec(function(error, results) {
        res.end(JSON.stringify(results, null, 2));
    })
});

app.get('/get/listings/:user', (req, res) => {
    var listing = mongoose.model('Item', ItemSchema);
    listing.find({user : req.params.user, stat: 'SALE'})
    .exec(function(error, results) {
        res.end(JSON.stringify(results, null, 2));
    })
});

app.get('/get/purchases/:user', (req, res) => {
    var purchase = mongoose.model('Item', ItemSchema);
    purchase.find({user : req.params.user, stat: 'SOLD'})
    .exec(function(error, results) {
        res.end(JSON.stringify(results, null, 2));
    })
});

app.get('/search/users/:keyword', (req, res) => {
    var keyUser = mongoose.model('User', UserSchema);
    keyUser.find({}).exec(function(error, results) {
        if (error) {console.log("KW CHECK");}
        let temp = [];
        for (i in results) {
            let user = results[i].username;
            if (user.includes(req.params.keyword)) {
                temp.push(results[i]);
            }
        }
        res.end(JSON.stringify(temp, null, 2));
    })
});

app.get('/search/items/:keyword', (req, res) => {
    var keyItem = mongoose.model('Item', ItemSchema);
    keyItem.find({}).exec(function(error, results) {
        if (error) {console.log("KW CHECK");}
        let temp = [];
        for (i in results) {
            let desc = results[i].description;
            if (desc.includes(req.params.keyword)) {
                temp.push(results[i]);
            }
        }
        res.end(JSON.stringify(temp, null, 2));
    })
});

app.post('/add/user/', (req, res) => {
    var add = JSON.parse(req.body.addUser);
    var userNew = new User(add);
    var user = mongoose.model('User', UserSchema);

    user.find({})
    .exec(function(error, results) {//console.log(results);
    })

    userNew.save(function(err){ if(err) console.log('error saving user - 1'); });
});

app.post('/add/item/:user', (req, res) => {
    var add = JSON.parse(req.body.addItem);
    var itemNew = new Item(add);
 
    var user = mongoose.model('User', UserSchema);

    user.find({username: req.params.user}).populate('listings') .exec(function(error, results) {
        let newTitle = itemNew.title;
        for (i in results) {
            results[i].listings.push(newTitle);
            results[i].save(function(err) { if (err) console.log('error saving items - 2'); });
        }
            //console.log(results[i]);
    });
    itemNew.save(function(err) { if (err) console.log('Error saving 3'); });
});


app.listen(port, () => {
    console.log('Server is running...');
});