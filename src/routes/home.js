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
    
})


module.exports = router;