/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 9; script.js

    File responsible to work as client in public_html and
    perform required actions on index.html.
*/

/*
  addUser()
  Function called when 'Add User' button is clicked.
*/
function addUser() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {return false;}

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log('Added user!');
            }
        }
    }
    let user = document.getElementById('username1').value;
    let pass = document.getElementById('password').value;
    let url = 'http://localhost:3000/add/user/';
    let addUser = {username: user, password: pass};
    let userStr = JSON.stringify(addUser);
    let params = 'addUser=' + userStr;

    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send(params);
}

/*
  addItem()
  Function called when 'Add Item' button is clicked.
*/
function addItem() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {return false;}

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log('Added item!');
            }
        }
    }
    let title = document.getElementById('title').value;
    let desc = document.getElementById('desc').value;
    let image = document.getElementById('image').value;
    let price = document.getElementById('price').value;
    let stat = document.getElementById('stat').value;
    let user = document.getElementById('username2').value;
    let url = 'http://localhost:3000/add/item/' + user;
    let addItem = {title: title, description: desc, image: image,
        price: price, stat: stat, user: user};
    let itemStr = JSON.stringify(addItem);
    let params = 'addItem=' + itemStr;

    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send(params);
}