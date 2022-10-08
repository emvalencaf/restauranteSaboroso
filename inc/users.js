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

    }

};