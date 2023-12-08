const { Router } = require('express')
const router = Router()
const dataController = require('../models/file');
const datosJson = new dataController();

router.post('/signup', (req, res) => {
    const { user, pass } = req.body;
    let data = datosJson.getData();


    //agregando el usuario a una var aux
    data[user] = {
        "auth": [
            {
                "pass": pass
            }
        ],
        "data": [
            {
            }
        ]
    }

    //volcado de la variable aux en database
    


    res.json(data);
    datosJson.save(data);
})
module.exports = router