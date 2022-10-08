const connection = require("./db.mysql")
const path = require('path')

module.exports = {

    getMenus(){

        return new Promise((resolve, reject) => {

            connection.query(`
            SELECT * FROM tb_menus ORDER BY title
            `, (err, results) => {

                if(err) return reject(err);

                resolve(results);

            });


        });
    },

    save(fields, files){

        return new Promise((resolve, reject)=>{

            fields.photo = `images/${path.parse(files.photo.filepath).base}`;

            connection.query(`
            INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)
            `,[
                fields.title,
                fields.description,
                fields.price,
                fields.photo
            ], (err, results) => {
                
                if(err) return reject(err);

                resolve(results);

            });

        });

    }
};