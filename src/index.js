const express = require('express')
const app = express()
const morgan = require('morgan')

const rutaHome = require('./routes/home')

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
//routes
app.use('/tasks',rutaHome)
app.listen(3000, ()=>{
    console.log("Se esta sirviendo")
})