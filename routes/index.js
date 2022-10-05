var conn = require('./../inc/db.mysql')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  conn.query(`
    SELECT * FROM tb_menus ORDER BY title
  `, (err, results) => {

    if(err){
      console.log(err)
    } else{

      res.render('index', {
        title: 'Restaurante Saboroso',
        menu: results
      });

    }

  })

});

router.get('/contacts', function(req, res, next){

  res.render('contacts', {
    title: 'Contato - Restaurante Saboroso',
    background:'images/img_bg_3.jpg',
    h1:'Diga um oi!'
  })

});

router.get('/menus', function(req, res, next){

  res.render('menus', {
    title: 'Menu - Restaurante Saboroso',
    background:'images/img_bg_1.jpg',
    h1:'Saborei nosso menu!'
  })

})

router.get('/reservations', function(req, res, next){

  res.render('reservations', {
    title: 'Reservas - Restaurante Saboroso',
    background:'images/img_bg_2.jpg',
    h1:'Reserve uma Mesa!'
  })

})

router.get('/services', function(req, res, next){

  res.render('services', {
    title: 'Serviços - Restaurante Saboroso',
    background:'images/img_bg_1.jpg',
    h1:'Um prazer poder servir!'
  })

})

module.exports = router;
