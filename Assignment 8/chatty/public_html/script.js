/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 8; script.js

    File responsible to work as client in public_html and
    perform required actions on index.html.
*/

/*
  send()
  Function called when 'send message' button is clicked.
*/
function send(){
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {return false;}

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {
        console.log('Transmission clear!');
      }
    }
  }
  
  words = document.getElementById('chatMessage').value;
  words = words.split(' ');
  wordString = words.join('+');
  alias = document.getElementById('alias').value;

  document.getElementById('chatMessage').value = ''
  
  let url = '/create/data/' + alias + '/' + wordString;
  
  httpRequest.open('POST', url);
  httpRequest.send(url);
}

/*
  getData()
  Function called once in a second, and responsible for
  updating all messages with names and text constantly.
*/
setInterval(getData, 1000);
function getData(){

  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {return false;}

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        document.getElementById('chatField').innerHTML = httpRequest.responseText;
      }
    }
  }

  let url = '/data';
  httpRequest.open('GET', url);
  httpRequest.send();
}