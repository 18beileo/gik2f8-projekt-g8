const express = require('express');
const app = express();
const fs = require('fs/promises');
const multer = require('multer');

const upload = multer({ dest: "./songs" });



app
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "*");

        next();
    });

    app.post("/upload_files", upload.array("files"), uploadFiles);

    function uploadFiles(req, res) {
        console.log(req.body);
        console.log(req.files);
        res.json({ message: "Successfully uploaded files" });
    }

    app.get("/maps",async (req,res) => {
        try{
            const maps = await fs.readFile("./maps.json");
            res.send(JSON.parse(maps));
        }
        catch(error){
            res.status(500).send({error: error.stack});
        }
    });

    app.post("/maps", async (req, res) => {
        try{
            const map = req.body;

            const listBuffer = await fs.readFile("./maps.json");
            const currentMaps = JSON.parse(listBuffer);

            let maxMapId = 1;

            if (currentMaps && currentMaps.length > 0) {
                maxMapId = currentMaps.reduce(
                  (maxId, currentElement) =>
                    currentElement.id > maxId ? currentElement.id : maxId, maxMapId);
            }
            
            const newMap = { id: maxMapId + 1, ...map };
            newMap.fileName = newMap.fileName.substring(0, newMap.fileName.length -4) + `_${newMap.id}` + newMap.fileName.substring(newMap.fileName.length -4, newMap.fileName.length);
            const newList = currentMaps ? [...currentMaps, newMap] : [newMap];
            
            await fs.writeFile("./maps.json", JSON.stringify(newList));
            res.send(newMap);
        }
        catch(error){
            res.status(500).send({error: error.stack});
        }
    });

    app.delete("/maps/:id",async (req, res) => {
        try{
            const id = req.params.id;
            const listBuffer = await fs.readFile("./maps.json");
            const currentMaps = JSON.parse(listBuffer);
            if(currentMaps.length > 0){
                await fs.writeFile("./maps.json", JSON.stringify(currentMaps.filter(map => map.id != id)));
                res.send({message: `Map with id ${id} deleted`})

            }else{
                res.status(404).send({error: "No map to delete"});
            }
        }
        catch(error){
            res.status(500).send({error: error.stack});
        }

    });

    app.listen(5000, () => console.log("Server running on localhost:5000"));