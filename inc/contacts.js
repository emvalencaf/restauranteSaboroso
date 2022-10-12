const connection = require("./db.mysql")

module.exports = {

    render(req, res, error, sucess){

        res.render('contacts', {
            title: 'Contato - Restaurante Saboroso',
            background:'images/img_bg_3.jpg',
            h1:'Diga um oi!',
            body: req.body,
            error,
            sucess
        });

    },

    getContacts(){

        return new Promise((resolve, reject) => {

            connection.query(`
            SELECT * FROM tb_contacts ORDER BY register DESC
            `, (err, results) => {

                if(err) return reject(err);

                resolve(results);

            });


        });
    },

    save(fields){

        return new Promise((resolve, reject) => {

            connection.query(`
                INSERT INTO tb_contacts (name, email, message)
                VALUES(?, ?, ?)
            `,[
                fields.name,
                fields.email,
                fields.message
            ], (err, results) => {

                if(err) return reject(err)

                resolve(results);

            });

        });

    },

    delete(id){

        return new Promise((resolve, reject) => {

            connection.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `,[
                id
            ], (err, results) => {
                console.error(err)
                if(err) reject(err);

                resolve(results);

            });
            
        });

    }


};