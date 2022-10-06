var conn = require('./../inc/db.mysql')
var express = require('express');
var router = express.Router();
var menus = require('../inc/menus.mysql')

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus()
    .then(results => {

      res.render('index', {
        title: 'Restaurante Saboroso',
        menus: results
      });


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

  menus.getMenus()
    .then(results => {

      res.render('menus', {
        title: 'Menu - Restaurante Saboroso',
        background:'images/img_bg_1.jpg',
        h1:'Saborei nosso menu!',
        menus: results
      });


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