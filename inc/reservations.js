const connect = require("./db.mysql")

module.exports = {
    render(req, res, error, sucess){

        res.render('reservations', {
            title: 'Reservas - Restaurante Saboroso',
            background:'images/img_bg_2.jpg',
            h1:'Reserve uma Mesa!',
            body: req.body,
            error,
            sucess
          });

    },

    save(fields){

        return new Promise((resolve, reject) => {


            const date = fields.date.split('/');

            fields.date = `${date[2]}-${date[1]}-${date[0]}`;

            connect.query(`
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES(?, ?, ?, ?, ?)
            `, [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ], (err, results) => {
    
                if(err) return reject(err);

                resolve(results);
    
            });


        });


    }
};