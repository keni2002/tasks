const { Router } = require('express')
const router = Router()
const dataController = require('../models/file');
const datosJson = new dataController();
const structureJSON = 
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
            }
        ]
    }

    //volcado de la variable  en database
    


    res.json(datosJson.save(data))
    
})
//barrer los datos
router.delete('/:user/flush',(req,res)=>{
    //te traes los datos
    let data = datosJson.getData();
    
    for( let i in data){
        if(i === req.params.user){
            if(data[i]["auth"][0].pass == req.body.pass){
                data[i]["data"] = {}
                res.json(datosJson.save(data))
            }
            break;
        }
    }
    res.json({message:"USER NOT LOGIN"})
    
})
module.exports = router