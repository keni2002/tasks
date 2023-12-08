const bcrypt = require('bcrypt')
//Metodo para validar usuarios
function esValid(data, user, pass) {
    for (let i in data) {
        if (i == user) 
            return (bcrypt.compareSync(pass, data[i]["auth"][0].pass)) 
    }
    return false
}
module.exports = esValid