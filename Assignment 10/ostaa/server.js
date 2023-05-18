/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 10; server.js

    File responsible to work as client in public_html and
    perform required actions.
*/
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mbdURL = 'mongodb://127.0.0.1/ostaaPt2';
const port = 3000;

app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

//Cookie/Session check
var sessionKeys = {};
function reviseLogin() {
    let curr = Date.now();
    for (e in sessionKeys) {
        if (sessionKeys[e][1] < (curr - 20000)) {
            delete sessionKeys[e];
        }
    }
}
setInterval(reviseLogin, 2000);

//DB Schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    listings: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Item' }] 
});
var User = mongoose.model('User', UserSchema);

var ItemSchema = new Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    status: String,
    user: String
});
var Item = mongoose.model('Item', ItemSchema);

mongoose.connect(mbdURL, {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'Mongo Error, check heree!'));

//authenticating
function authenticate(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
      let u = req.cookies.login.username;
      let key = req.cookies.login.key;
      if (Object.keys(sessionKeys[u]).length > 0 && sessionKeys[u][0] == key) {
        next();
      } else {res.send('auth inner');}
    } else {res.send('auth outer');} 
}

app.use('/public_html/home.html', authenticate);
app.use('/', express.static('public_html'));

app.get('/getUser', (req, res) => {
    res.send(req.cookies.login.username);
});

//creating user
app.get('/create/:user/:pass', (req, res) => {
   let u = req.params.user;
   let p = req.params.pass;
   User.find({username: u}).exec(function(error, results) {
    if (results.length == 0) {
           var account = new User({'username' : u, 'password': p});
           account.save(function (err) { if (err) console.log('Error creating')});
           res.send('Account created!');
       }
       else{
            res.send('Username exists.');
       }
   })
});

//logining in user
app.get('/login/:user/:pass', (req, res) => {
    let u = req.params.user;
    let p = req.params.pass;
    User.find({username: u, password: p}).exec(function(error, results) {
        if (results.length == 1) {
            let sessionKey = Math.floor(Math.random() * 1000);
            sessionKeys[u] = [sessionKey, Date.now()];
            res.cookie("login", {username: u, key:sessionKey}, {maxAge: 900000});
            res.send('OK');
        } 
        else {
        res.send('Invalid credentials');
        }
    });
});

//get user listings
app.get('/get/listings/:user', (req, res) => {
    var listing = mongoose.model('Item', ItemSchema);
    listing.find({user : req.params.user, status: 'SALE'}).exec(function(error, results) {
        var str = " ";
        for (i in results) {
            str += ("Item: ".bold() + '<span id = "title">' + results[i].title  + '</span>' + 
                '<br>' + "Description: ".bold() + results[i].description + '<br>' + 
                "Image: ".bold() + results[i].image + '<br>' + 
                "Price: ".bold() + results[i].price + '<br>' + 
                "Status: ".bold() + results[i].status) + '<br>';
            str += ' <button class = "lol" onclick=status();>Buy Now</button><br><br> ';
        }
        res.send(str);
    })
});

//get user purchases
app.get('/get/purchases/:user', (req, res) => {
    var purchase = mongoose.model('Item', ItemSchema);
    purchase.find({user : req.params.user, status: 'SOLD'})
    .exec(function(error, results) {
        var str = " ";
        for (i in results) {
            str += ("Item: ".bold() + '<span id = "title">' + results[i].title  + '</span>' + 
                '<br>' + "Description: ".bold() + results[i].description + '<br>' + 
                "Image: ".bold() + results[i].image + '<br>' + 
                "Price: ".bold() + results[i].price + '<br>' + 
                "Status: ".bold() + results[i].status) + '<br><br>';
        }
        res.send(str);
    })
});                                                             

//search user keywords
app.get('/search/users/:keyword', (req, res) => {
    var keyUser = mongoose.model('User', UserSchema);
    keyUser.find({}).exec(function(error, results) {
        if (error) {console.log(error);}
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

//search user keyword items
app.get('/search/items/:keyword', (req, res) => {
    var keyItem = mongoose.model('Item', ItemSchema);
    keyItem.find({}).exec(function(error, results) {
        if (error) {console.log(error);}
        let temp = [];
        for (i in results) {
            let desc = results[i].description;
            if (desc.includes(req.params.keyword)) {
                temp.push(results[i]);
            }
            var str = " ";
            for (i in temp) {
                str += ("Item: " + '<span id = "title">' + temp[i].title + '</span>' + '<br>' 
                    + "Description: ".bold() + temp[i].description + '<br>' 
                    + "Image: ".bold() + temp[i].image + '<br>' 
                    + "Price: ".bold() + temp[i].price + '<br>' 
                    + "Status: ".bold() + temp[i].status) +'<br>';
                str += ' <button class = "lol" onclick=status();>Buy Now</button><br><br> ';
            }    
        }
        res.send(str);
    })
});

//change sale to sold
app.get('/change/:title', (req, res) => {
    var changeItem = mongoose.model('Item', ItemSchema);
    changeItem.find({title: req.params.title}).exec(function(error, results) {
        for (i in results) {
            if (results[i].status == "SALE") {
                results[i].status = "SOLD";
                results[i].save(function(err) { if (err) console.log('error changing'); });
            }
        }
    })
});

//post a new item
app.post('/add/item/:user', (req, res) => {
    var add = JSON.parse(req.body.addItem);
    var newItems = new Item(add);
    var u = mongoose.model('User', UserSchema);
    u.find({username: req.params.user}).populate('listings').exec(function(error, results) {
        let newTitle = newItems.title;
        for (i in results) {
            results[i].listings.push(newTitle);
            results[i].save(function(err) { if (err) console.log('Error occurred.'); });
        }
    });
    newItems.save(function(err) { if (err) console.log('Error occurred.'); });
});

app.listen(port, () => {
    console.log(`Server Started`)
})