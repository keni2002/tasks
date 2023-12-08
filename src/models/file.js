const path = require('path')
const fs = require('fs')

function validate(data,auth){
    for (let i in data){
        if(i == auth.user){
            if(data[i]["auth"][0].pass == auth.pass){
                return data[i]["data"]
            }
            break;
        }
    }
    return {message: "AUTHENTICATION FAILURE"}
}

class Database {
    save(object){
        try{
            fs.writeFileSync(path.join(__dirname,"database.json"), JSON.stringify(object))
            return {mensaje: "success"}
        }
        catch(error){
            return {error:error}
        }
    }
    read(authentication){
        let Datos = JSON.parse(fs.readFileSync(path.join(__dirname,"database.json")));
        return validate(Datos,authentication)
    }
    getData(){

        return JSON.parse(fs.readFileSync(path.join(__dirname,"database.json")))
    }
};
module.exports = Database;