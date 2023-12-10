const { Router } = require('express')
const router = Router()
const esValid = require('../handlers/esValid');
const bcrypt = require('bcrypt')

const dataController = require('../models/file');
const datosJson = new dataController();

router.post('/signup', (req, res) => {
    const { user, pass } = req.body;
    let data = datosJson.getData();
    //verifico si existe ya el user
    const existeUser = Object.keys(data).find((u) => user === u)
    if (existeUser) return res.json({ message: "error user exists" })

    //agregando el usuario
    //generating hard security hash
    const saltRounds = 11
    const newPass = bcrypt.hashSync(pass, saltRounds);

    data[user] = {
        "auth": [
            {
                "pass": newPass
            }
        ],
        "data": [
            {
                "id": -1
            }
        ]
    }
    //volcado de la variable  en database
    return res.json(datosJson.save(data))
})


//barrer los datos
router.delete('/:user/flush', (req, res) => {
    //te traes los datos
    let data = datosJson.getData();
    const { user, pass } = req.body
    if (esValid(data, user, pass)) {
        data[user]["data"] = {}
        return res.json(datosJson.save(data))
    }
    res.json({ message: "error login" })
})

//barrer usuarios
router.delete('/:user/destroy', (req, res) => {
    let data = datosJson.getData();
    const { user, pass } = req.body
    if (esValid(data, user, pass)) {
        //FORMA PARA ELIMINAR UN ELEMENTO POR LA CLAVE EN JSON
        delete data[user]
        
        return res.json(datosJson.save(data))
    }
    res.json({ message: "error login" })
})
module.exports = router