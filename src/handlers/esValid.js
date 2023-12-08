//Metodo para validar usuarios
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
module.exports = esValid