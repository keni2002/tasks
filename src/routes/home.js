const { Router } = require('express')
const router = Router()
const path = require('path')
const fecha = require('../handlers/fecha');
const esValid = require('../handlers/esValid')

const dataController = require('../models/file');
const datosJson = new dataController();

let myChecker = (datos, usuario, passwd, arrayToCheck) => {
    if (esValid(datos, usuario, passwd)) {
        
        const elements = datos[usuario]["data"]
        let wasItEdit = false

        for (let i in arrayToCheck) {
            for (let j in elements) {
                if (elements[parseInt(j)].id === parseInt(arrayToCheck[i])) {
                    datos[usuario]["data"][parseInt(j)].checked = !datos[usuario]["data"][parseInt(j)].checked
                    wasItEdit = true
                }
            }
        }
        if (wasItEdit) {
            return datosJson.save(datos)
        } else return { message: "not match" }
    }
    return { message: "error login" }
}
router.put('/', (req, res) => {
    let data = datosJson.getData();
    const { user, pass, array } = req.body
    return res.json(myChecker(data, user, pass, array))
})

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

        if (taskFound) return res.json(taskFound)
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
            "dateTarget": req.body.dateTarget,
            "checked": false
        }
        //pull fuerte al archivo
        return res.json(datosJson.save(data))
    }
    return res.json({ message: "error login" })
})

//metodo que une se usa para los metodos de eliminar y eliminacion masiva
let myDelete = (datos, usuario, passwd, arrayToDelete) => {
    if (esValid(datos, usuario, passwd)) {
        //no uso find porque necesito el index puro del array
        const elements = datos[usuario]["data"]
        let wasItDeletion = false

        for (let i in arrayToDelete) {
            for (let j in elements) {
                if (elements[parseInt(j)].id === parseInt(arrayToDelete[i])) {
                    if (parseInt(arrayToDelete[i]) === -1) return { message: "forbidden" }
                    datos[usuario]["data"] = datos[usuario]["data"].filter((d) => d.id != arrayToDelete[i])
                    wasItDeletion = true
                }
            }
        }
        if (wasItDeletion) {
            return datosJson.save(datos)
        } else return { message: "not match" }
    }
    return { message: "error login" }
} //end mydelete funct
//importante que esto este arriba de one delete
router.delete('/delete/some', (req, res) => {
    let data = datosJson.getData();
    const { user, pass, array } = req.body
    return res.json(myDelete(data, user, pass, array))
})

router.delete('/delete/:id', (req, res) => {
    let data = datosJson.getData();
    const { user, pass, array } = req.body
    return res.json(myDelete(data, user, pass, [req.params.id]))
})

router.put('/:id', (req, res) => {
    if (parseInt(req.params.id) === -1) return { message: "forbidden" }
    let data = datosJson.getData();
    const { user, pass,title, description, dateTarget } = req.body;
    if (esValid(data, user, pass)) {
        for (let j in data[user]["data"]) {
            if (data[user]["data"][parseInt(j)].id === parseInt(req.params.id)) {
               if(title) data[user]["data"][j].title = title
               if(description) data[user]["data"][j].description = description
               if(dateTarget) data[user]["data"][j].dateTarget = dateTarget
               return res.json(datosJson.save(data))
            }
        }
        return res.json({message: "no match"})
    }
    return res.json({ message: "error login" })
})
module.exports = router;