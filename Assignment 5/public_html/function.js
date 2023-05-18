/*
Aditya Gupta
CSC 337 PA5

function.js
Assignment 5 - Welcome to the Jumble
This assignment aims to implement and showcase
Caesar Cipher and Square Cipher implementation
of the text the user inputs.

function.js is a javaScript file for index.html
which implements functions that call and apply
Caesar Cipher and Square Cipher encryption to the
text input by the user. It also implements basic 
helper functions, and minor functions that help
the html page look as desired in the spec sheet.
*/

//updateSliderVal - updates displayed slider value in HTML
function updateSliderVal(val){
    document.getElementById('sliderNo').textContent = val; 
}

function mod(n, p){
    return n - p * Math.floor(n / p);
}

/*
encrypt is called to encrypt the text input by user
according to the slider value according to the
Caesar Cipher algorithm.

Parameters:
    text - string input by user
    slider - slider value

Returns:
    message - encrypted text
*/
function encrypt(text, slider){
    var message = "";

    for (var i = 0; i < text.length; i++){
        var code = text.charCodeAt(i);
    
        if (code >= 65 && code <= 65 + 26 - 1){
            code -= 65;
            code = mod(code + slider, 26);
            code += 65;
        }
        /*
        if (code >= 97 && code <= 97 + 26 - 1){
            code -= 97;
            code = mod(code + slider, 26);
            code += 97;
        }
        */

        message += String.fromCharCode(code);
    }
    return message;
}

//cZar calls encrypt method to complete the
//implementation of the Caesar Cipher function in HTML.
function cZar(){
    var text = document.getElementById("Itext").value.toUpperCase();
    var key = document.getElementById("myRange").value;

    document.getElementById('sqText').innerText = text; 
    document.getElementById('CText').innerText = encrypt(text, +key);
}

/*
function sZar(){
    var text = document.getElementById("Itext").value.toUpperCase();
    document.getElementById('sqText').innerText = text; 
}
*/

var alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXY';

//helper to initialise square in HTML web-page
function SSquare(){
    showSquare(alphas)  ; 
}

/*
showSquare takes a string of alphabets, and draws the 
square table using tr/td that follows square ciphers algorithm

Parameters:
    s - string of alphabets

Returns: Null
*/
function showSquare(s){
    s = s.split('');
    var grid = [];
    while (s.length > 0){
        var row = [];
        for (let i = 0; i < 5; i ++){
            row.push('<td>' + s[i] + '</td>');
        }
        grid.push('<tr>'+row.join('')+'</tr>');
        s.splice(0, 5);
    }
    grid = grid.join('');
    document.getElementById('square').innerHTML = grid;
}

/*
shuffle is used to shuffle the elements of 
the square according to square cipher method

Parameters:
    s - string of alphabets

Returns: Null
*/
function shuffle(s){
    s = s.split('');
    for(let j = s.length - 1; j > 1; j--){
        var k = Math.floor(Math.random() * j);
        if (!(k == j)){
            [s[k], s[j]] = [s[j], s[k]];
        }
    }
    alphas = s.join('');
}

//implementation of squareCipher based on
//user input, and resulting in new array
function squareCipher(){
    newOrderA = alphas.split('');
    inputA = document.getElementById("Itext").value.toUpperCase();
    newArray = [];
    for (let i = 0 ; i < inputA.length; i++) {
        c = inputA[i].charCodeAt(0);
        if (c >= 65 && c < 90) {
            c = c - 65;
            newArray.push(newOrderA[c]);
        } else {
            newArray.push(String.fromCharCode(c));
        }
    }
    return newArray.join('');
 }

var sent;

//implementations of text which is displayed adrer the
//square cipher algorithm is printed
function showText(){
    const bottomText = document.getElementById('sqText');
    sent = squareCipher()
    bottomText.textContent = squareCipher();
}
function retain(){
    const bottomText = document.getElementById('sqText');
    bottomText.textContent = sent;
    console.log(bottomText.textContent);
}

function butClick(){
    shuffle(alphas);
    showSquare(alphas);
    squareCipher();
    showText();
}