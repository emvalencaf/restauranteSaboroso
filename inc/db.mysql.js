const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:'localhost',
    user:'admin',
    database:'restaurantesaboroso',
    password:'mwvi6tkQ!F18'
})

module.exports = connection