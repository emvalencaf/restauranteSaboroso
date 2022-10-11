const connection = require("./db.mysql")

module.exports = {
    render(req, res, error){

        res.render('admin/login',{
            body: req.body,
            error
        });

    },


    login(email, password){

        return new Promise((resolve, reject)=>{

            connection.query(`
                SELECT * FROM tb_users WHERE email = ?
            `, [
                email
            ], (err, results)=>{

                if(err) return reject(err);

                if(!results.length > 0) return reject({
                    message:"usuário ou senha incorretos"
                });

                let row = results[0];
                console.log(results);
                if(row.password !== password) reject({message:'senha incorreta'});

                resolve(row);
            });

        });

    },

    getUsers(){

        return new Promise((resolve, reject) => {

            connection.query(`
            SELECT * FROM tb_users ORDER BY name
            `, (err, results) => {

                if(err) return reject(err);

                resolve(results);

            });


        });
    },

    save(fields){

        return new Promise((resolve, reject)=>{

            params = [

                fields.name,
                fields.email
                
            ];

            if(parseInt(fields.id) > 0){

                params.push(fields.id);

                query = `
                    UPDATE tb_users
                    SET name = ?,
                        email = ?
                    WHERE id = ?
                `;

            } else {

                query =`
                    INSERT INTO tb_users (name, email, password)
                    VALUES (?, ?, ?)
                `

                params.push(fields.password)

            };

            connection.query(query, params, (err, results) => {
                
                if(err) return reject(err);

                resolve(results);

            });

        });

    },

    delete(id){

        return new Promise((resolve, reject) => {

            connection.query(`
                DELETE FROM tb_users WHERE id = ?
            `,[
                id
            ], (err, results) => {

                if(err) reject(err);

                resolve(results);

            });
            
        })

    }

};