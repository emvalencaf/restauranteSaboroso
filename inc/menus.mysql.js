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

            console.log(fields);
            console.log(files);

            fields.photo = `images/${path.parse(files.photo.filepath).base}`;

            let query, queryPhoto = '', params;

            params = [

                fields.title,
                fields.description,
                parseInt(fields.price)
                
            ]

            console.log(params)

            if(files.photo.originalFilename){

                queryPhoto = ',photo = ?';
                params.push(fields.photo);
            }

            if(parseInt(fields.id) > 0){

                params.push(fields.id);

                query = `
                    UPDATE tb_menus
                    SET title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto}
                    WHERE id = ?

                `;

            } else {

                if(!files.photo){
                    reject('Envie a foto do prato.')
                }

                query =`
            INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)
            `

            }

            connection.query(query, params, (err, results) => {
                
                if(err) return reject(err);

                resolve(results);

            });

        });

    },

    delete(id){

        return new Promise((resolve, reject) => {

            connection.query(`
                DELETE FROM tb_menus WHERE id = ?
            `,[
                id
            ], (err, results) => {

                if(err) reject(err);

                resolve(results);

            });
            
        })

    }
};