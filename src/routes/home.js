const { Router } = require('express')
const router = Router()
const path = require('path')
const fecha = require('../handlers/fecha');
const esValid = require('../handlers/esValid')

const dataController = require('../models/file');
const datosJson = new dataController();

router.get('/', (req, res) => {
    let data = datosJson.getData();
    const { user, pass } = req.body
    if (esValid(data, user, pass))
        return res.json(data[user]["data"].slice(1))
    else return res.json({ message: "error login" })
})

router.get('/:id', (req, res) => {
    let data = datosJson.getData();
    const { user, pass } = req.body
    if (esValid(data, user, pass)) {

        const taskFound = data[user]["data"].find((t) => {
            return t.id === parseInt(req.params.id)
        })
        if (taskFound) return res.json(data[user]["data"][req.params.id])
        else return res.status(404).json({ message: "error no source" })

    } else {
        res.json({ message: "error login" })
    }
})

router.post('/add', (req, res) => {
    let data = datosJson.getData();
    const { user, pass } = req.body
    if (esValid(data, user, pass)) {
        //buscar el mayor id
        const may = Math.max(...data[user]["data"].map(obj => obj.id));
        //modificando el json data temporal
        //defino el array de datas
        let dArray = data[req.body.user]["data"]
        //agregar un nuevo elemento apartir de aqui
        data[req.body.user]["data"][dArray.length] = {
            "id": may + 1,
            "title": req.body.title,
            "description": req.body.description,
            "date": fecha(),
            "date-target": req.body.dateTarget,
            "checked": false
        }
        //pull fuerte al archivo
        return res.json(datosJson.save(data)) 
    }
    return res.json({ message: "error login" })
})


module.exports = router;