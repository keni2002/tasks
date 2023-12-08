const { Router }= require('express')
const router = Router()
const path = require('path')
const dataController = require('../models/file');
const fecha = require('../handlers/fecha');
const datosJson = new dataController();

router.get('/', (req,res) => {
    console.log(req.body)
    res.json(datosJson.read(req.body))
    
})

router.post('/add',(req,res)=>{
    let data = datosJson.getData();
    for (let i in data){
        if(i == req.body.user){
            if(data[i]["auth"][0].pass == req.body.pass){
                //buscar el mayor id
                let max=0
                for (let j in data[i]["data"]){
                    //v de valor
                    let v = data[i]["data"][j]
                    if(parseInt(v.id) >= max ) max = v.id
                    
                }
                //modificando el json data temporal
                //defino el array de datas
                let dArray  = data[req.body.user]["data"]
                //agregar un nuevo elemento apartir de aqui
                data[req.body.user]["data"][dArray.length] = {
                    "id": max+1,
                    "title": req.body.title,
                    "description": req.body.description,
                    "date": fecha(),
                    "date-target": req.body.dateTarget
                }
                //pull fuerte al archivo
                
                datosJson.save(data)
                res.json({message: "success"})
            }
            break;
        }
    }
    res.json({message:"USER NOT LOGIN"})
})


module.exports = router;