const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const server = app.listen(3001,() =>{
    console.log('Start Server : localhost:3001');
})
app.use(express.static('public'));
app.get('/tekken/:version', async (req, res) =>{
    let version = req.params;
    res.sendFile(path.join(__dirname,'public','index.html'));
})
app.get('/tekken/:version/api/:character', async (req, res) =>{
    let {
        version,
        character
    } = req.params;
    character = character.toLowerCase();
    if(character.match('characterlist')){
        console.log('characterList');
        fs.readFile(`./character${version}/characterList.json`,`utf8`,(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send('Internal Server Error : characterList.json');
                return;
            }
    
            const characterList = JSON.parse(data);
            res.json(characterList);
        });
    }else{
        console.log(`version = ${version}`);
        console.log(`character = ${character}`);
        
        fs.readFile(`./character${version}/${character}.json`,'utf8',(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send(`Internal Server Error : ${character}.json`);
                return;
            }
    
            //Json 데이터 파싱하여 클라이언트에 전송
            const characterData = JSON.parse(data);
            res.json(characterData);
        });
    }
});