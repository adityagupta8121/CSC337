/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 10; script.js

    File responsible to work as client in public_html and
    perform required actions.
*/

var user = "";
var httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = () => {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
        user = httpRequest.responseText; 
    } 
  }
}

httpRequest.open('GET', '/getUser', true);
httpRequest.send();

function login() {
    var httpRequest = new XMLHttpRequest();    
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;
  
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          if (httpRequest.responseText == 'This account does not exist') {
              window.alert('This account does not exist');
          } else {
            let url = '/home.html';
            window.location = url;
          }       
        } else {alert('problem login');}
      }
    }
  
    httpRequest.open('GET', '/login/' + user + '/' + pass);
    httpRequest.send();
}
  
function create() {
    var httpRequest = new XMLHttpRequest();
    let u = document.getElementById('usernameNew').value;
    let p = document.getElementById('passwordNew').value;
  
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          alert(httpRequest.responseText);
        } 
        else {alert('problem create');}
      }
    }

    httpRequest.open('GET', '/create/' + u + '/' + p, true);
    httpRequest.send();

    document.getElementById('usernameNew').value = "";
    document.getElementById('passwordNew').value = "";
}

function addItems() {
    let title = document.getElementById('title').value;
    let desc = document.getElementById('desc').value;
    let image = document.getElementById('image').value;
    let price = document.getElementById('price').value;
    let stat = document.getElementById('stat').value;
    let user = document.getElementById('username2').value;

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                alert('Successfully added items!')
            }
            else {
                alert('problem add');
            }
        }
    }
    let url = '/add/item/' + user;
    let addItem = {title: title, description: desc, image: image,
        price: price, status: stat, user: user};
    let addItem_str = JSON.stringify(addItem);
    let params = 'addItem=' + addItem_str;
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send(params);
}

function viewLists() {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
          console.log(httpRequest.responseText);
          let postList = document.getElementById('right');
          postList.innerHTML = httpRequest.responseText;
        } 
        else {alert('problem list');}
      }
    }
    httpRequest.open('GET', '/get/listings/' + user, true);
    httpRequest.send();
}

function viewPurch() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
          console.log(httpRequest.responseText);
          let postList = document.getElementById('right');
          postList.innerHTML = httpRequest.responseText;
      } 
      else {alert('problem purchase');}
    }
  }
  httpRequest.open('GET', '/get/purchases/' + user, true);
  httpRequest.send();
}

function search() {
  let keyword = document.getElementById('squery').value;
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
          console.log(httpRequest.responseText);
          let postList = document.getElementById('right');
          postList.innerHTML = httpRequest.responseText;
      } 
      else {alert('problem search');}
    }
  }
  httpRequest.open('GET', '/search/items/' + keyword, true);
  httpRequest.send();
}

function status() {
  let title = document.getElementById('title').innerHTML;
  console.log(title);
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
          console.log('Changed!');
      } 
      else { 
          console.log('problem changing'); 
      }
    }
  }
  httpRequest.open('GET', '/change/' + title, true);
  httpRequest.send();
}