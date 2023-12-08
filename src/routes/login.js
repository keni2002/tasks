const { Router } = require('express')
const router = Router()
const dataController = require('../models/file');
const esValid = require('../handlers/esValid');
const datosJson = new dataController();

router.post('/signup', (req, res) => {
    const { user, pass } = req.body;
    let data = datosJson.getData();
    //agregando el usuario 
    data[user] = {
        "auth": [
            {
                "pass": pass
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
module.exports = router