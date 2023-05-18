/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 7; script.js

    File responsible to work as client in public_html and
    perform required actions on index.html. Using XMLHTTPRequest and AJAX.
    IP address 127.0.01 used, which is local pc, and port 3000
*/
function processInput(){
    var request = new XMLHttpRequest();

    var inputOption = document.getElementById("inputOption");
    var outputOption = document.getElementById("outputOption");
    var content = document.getElementById("inputContent").value.split(' ').join('+').toLowerCase();
    var inputValue = inputOption.options[inputOption.selectedIndex].value;
    var outputValue = outputOption.options[outputOption.selectedIndex].value;
    var langCombi = inputValue + "2" + outputValue;

    if (!request){return false;}

    console.log(content);
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                console.log(request.responseText);
                let output = document.getElementById("outputContent");
                let temp = request.responseText.toLowerCase();
                if (typeof temp === "undefined") {
                    output.innerText = "?";
                }
                else {
                    output.innerText = request.responseText;  
                }
            
            } else { 
                document.getElementById("outputContent").innerText = " ";
            }
        }
    }

    let url = 'http://localhost:3000/translate/' + langCombi +'/' + content;
    request.open('GET', url);
    request.send();
}