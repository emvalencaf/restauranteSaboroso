const connection = require("./db.mysql")

module.exports = {

    getMenus(){

        return new Promise((resolve, reject) => {

            connection.query(`
            SELECT * FROM tb_menus ORDER BY title
            `, (err, results) => {

                if(err) return reject(err)

                resolve(results)

            })


        })
    }
}