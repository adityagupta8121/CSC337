/*
    Author: Aditya Gupta
    Course: CSC 337
    Assignment 7; translator.js

    File responsible to run the server for translation that helps translation
    from german, english and spanish.
    IP address 127.0.01 used, which is local pc, and port 3000
*/
const ipaddress = '127.0.0.1';
const port = 3000;
const fileSpanish = './Spanish.txt'
const fileGerman = './German.txt'

const fs = require('fs');
const readLine = require('readline');
const express = require('express')
const app = express()


e2s = {};
s2e = {};
e2g = {};
g2e = {};

/*
  fileToTranslate creates dictionaries that help map
  original word to the translated word.

  Parameters -
    fileName: String which is the filename
    fromEng: String, mapped to initial language
    toEng: String, mapped to final language

  Returns - None
*/
async function fileToTranslate(fileName, fromEng, toEng){
  const readline = readLine.createInterface({
    input: fs.createReadStream(fileName)
  });
  
  for await(const line of readline){
    if(line.startsWith('#')){
      continue;
    }
    wordsList = line.split('\t');
    if(wordsList.length < 2){
      continue;
    }
    var initial = wordsList[0].toLowerCase().trim();
    var final = wordsList[1].toLowerCase().trim();
    let search = final.search('[^a-z ]');
    final = search == -1 ? final : final.substring(0, search);
    toEng[final] = initial.trim()
    fromEng[initial] = final.trim();
  }
}

fileToTranslate(fileSpanish, e2s, s2e);
fileToTranslate(fileGerman, e2g, g2e);

app.use(express.static('public_html'))

/*
    Fetching URL, splitting to perform required translation
    and match the requirements of the project. Previous approach
    of Assigment 6 was giving errors and so had to do it this way.
*/
app.get('/:command/:optionLang/:text', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    var optionLang = req.params.optionLang;
    var text = req.params.text;
    var translation;

    if (optionLang == 'e2s'){
        var toTrans = text.split('+');
        var translation = '';
        for (i = 0; i < toTrans.length; i++){
            if(typeof e2s[toTrans[i]] === 'undefined'){
                translation += "?";
            }
            else{
                translation += e2s[toTrans[i]];
            }
            translation += ' ';
        }
        res.send(translation);
    }
    else if (optionLang == 's2e'){
        var toTrans = text.split('+');
        var translation = '';
        for (i = 0; i < toTrans.length; i++){
            if(typeof s2e[toTrans[i]] === 'undefined'){
                translation += "?";
            }
            else{
                translation += s2e[toTrans[i]];
            }
            translation += ' ';
        }
        res.send(translation);
    }
    else if (optionLang == 'e2g'){
        var toTrans = text.split('+');
        var translation = '';
        for (i = 0; i < toTrans.length; i++){
            if(typeof e2g[toTrans[i]] === 'undefined'){
                translation += "?";
            }
            else{
                translation += e2g[toTrans[i]];
            }
            translation += ' ';
        }
        res.send(translation);
    }
    else if (optionLang == 'g2e'){
        var toTrans = text.split('+');
        var translation = '';
        for (i = 0; i < toTrans.length; i++){
            if(typeof g2e[toTrans[i]] === 'undefined'){
                translation += "?";
            }
            else{
                translation += g2e[toTrans[i]];
            }
            translation += ' ';
        }
        res.send(translation);
    }
    else if (optionLang == 'g2s'){
        var toTrans = text.split('+');
        var translation = '';
        for (i = 0; i < toTrans.length; i ++){
            let engWord = g2e[toTrans[i]];
            if(typeof e2s[engWord] === 'undefined'){
                translation += "?";
            }
            else{
                translation += e2s[engWord];
            }
            translation += ' ';
        }
        res.send(translation);
    }
    else if (optionLang == 's2g'){
        var toTrans = text.split('+');
        var translation = '';
        for (i = 0; i < toTrans.length; i ++){
            let engWord = s2e[toTrans[i]];
            if(typeof e2g[engWord] === 'undefined'){
                translation += "?";
            }
            else{
                translation += e2g[engWord];
            }
            translation += ' ';
        }
        res.send(translation);
    }

});

app.listen(port, () => console.log('Server listening'))