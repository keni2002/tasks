const path = require('path')
const fs = require('fs')

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
    getData(){

        return JSON.parse(fs.readFileSync(path.join(__dirname,"database.json")))
    }
};
module.exports = Database;