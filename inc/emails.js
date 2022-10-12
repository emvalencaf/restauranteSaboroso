const connection = require("./db.mysql");

module.exports = {


    getEmails(){

        return new Promise((resolve, reject) => {

            connection.query(`
            SELECT * FROM tb_emails ORDER BY email
            `, (err, results) => {

                if(err) return reject(err);

                resolve(results);

            });


        });
    },

    save(fields){

        return new Promise((resolve,reject) => {

            if(!fields.email){

                reject('Preencha o e-mail');
            
              } else {
            
                connection.query(`
                INSERT INTO tb_emails (email) VALUES(?)
                `,[
                  fields.email
                ], (err, results) => {

                    if(err) reject(err.message);
                    
                    console.log(results);

                    resolve(results);


                })
            
              };

        });
    },

    delete(id){

        return new Promise((resolve, reject) => {

            connection.query(`
                DELETE FROM tb_emails WHERE id = ?
            `,[
                id
            ], (err, results) => {
                console.error(err)
                if(err) reject(err);

                resolve(results);

            });
            
        });

    }


}