const { Router } = require('express')
const router = Router()
const path = require('path')
const dataController = require('../models/file');
const fecha = require('../handlers/fecha');
const datosJson = new dataController();

router.get('/', (req, res) => {
    res.json(datosJson.read(req.body))
})

//trying a method
function esValid(data, user, pass) {
    for (let i in data) {
        if (i == user) {
            if (data[i]["auth"][0].pass == pass) {
                return true
            }
        }
        break
    }
    return false
}
router.get('/:id', (req, res) => {
    let data = datosJson.getData();
    const { user, pass } = req.body
    if (esValid(data,user,pass)) {
        
        const taskFound = data[user]["data"].find((t)=>{
            return t.id === parseInt(req.params.id)
        })
        if(taskFound) return res.json(data[user]["data"][req.params.id])
        else return res.status(404).json({message: "error no source"})
       
    } else {
        res.json({message:"error login"})
    }
})



router.post('/add', (req, res) => {
    let data = datosJson.getData();
    for (let i in data) {
        if (i == req.body.user) {
            if (data[i]["auth"][0].pass == req.body.pass) {
                //buscar el mayor id
                let max = -2
                for (let j in data[i]["data"]) {
                    //v de valor
                    let v = data[i]["data"][j]
                    if (parseInt(v.id) > max) max = v.id

                }
                
                //modificando el json data temporal
                //defino el array de datas
                let dArray = data[req.body.user]["data"]
                //agregar un nuevo elemento apartir de aqui
                data[req.body.user]["data"][dArray.length] = {
                    "id": max + 1,
                    "title": req.body.title,
                    "description": req.body.description,
                    "date": fecha(),
                    "date-target": req.body.dateTarget,
                    "checked": false
                }
                //pull fuerte al archivo

                datosJson.save(data)
                return res.json({ message: "success" })
            }
            break;
        }
    }
    return res.json({ message: "error login" })
})


module.exports = router;