var conn = require('./../inc/db.mysql')
var express = require('express');
var router = express.Router();
var menus = require('../inc/menus.mysql')
var reservations = require('../inc/reservations')
var contacts = require('../inc/contacts');
var emails = require('../inc/emails');

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus()
    .then(results => {

      res.render('index', {
        title: 'Restaurante Saboroso',
        menus: results,
        isHome: true
      });


    })

});

router.get('/contacts', function(req, res, next){

  contacts.render(req, res)

});

router.post('/contacts', function(req, res, next){

  try{

    if(!req.body.name) throw new Error('Digite um nome')

    if(!req.body.email) throw new Error('Digite um email')
    
    if(!req.body.message) throw new Error('Digite uma mensagem')

    contacts.save(req.body)
      .then(results => {
        
        req.body = {}
        contacts.render(req, res, null, 'Contato enviado com sucesso!')

      })
      .catch(err => {

        contacts.render(req, res, err)

      })

  }catch(err){

    contacts.render(req, res, err.message)

  }

})

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

  reservations.render(req, res)

})

router.post('/reservations', function(req, res, next){
  try{
    if(!req.body.name) throw new Error('Digite um nome')
  
    if(!req.body.email) throw new Error('Digite um email')
  
    if(!req.body.people) throw new Error('Selecione o número de pessoas')
  
    if(!req.body.date) throw new Error('Selecione uma data')
  
    if(!req.body.time) throw new Error('Selecione um horário')
  
    reservations.save(req.body)
      .then(results => {

        req.body = {}
        
        reservations.render(req, res, null, 'Reserva realizada com sucesso!')

      })
      .catch(err => {

        reservations.render(req, res, err.message, null)

      })

  }catch(err){
    
    reservations.render(req, res, err.message, null)

  }

})

router.get('/services', function(req, res, next){

  res.render('services', {
    title: 'Serviços - Restaurante Saboroso',
    background:'images/img_bg_1.jpg',
    h1:'Um prazer poder servir!'
  });

});

router.post('/subscribe', function(req, res, next){
  
  emails.save(req.fields)
    .then(results => res.send(results))
    .catch(err => res.send(err))

})

module.exports = router;
