var express = require('express');
const { route } = require('.');
var router = express.Router();
var users = require('../inc/users');

router.use(function(req, res, next){
    

    //if(!req.session.user) res.redirect('/admin/login')
    if(['/login'].indexOf(req.url) === -1 && !req.session.user) {

        res.redirect('/admin/login');
        
    } else {

        next();

    };

})

router.get('/', function(req, res, next){

    res.render('admin/index', {
    });

});

router.get('/logout', function(req, res, next){

    delete req.session.user

    res.redirect('/admin/login')

})

router.get('/login', function(req, res, next){

    users.render(req, res, null)

});

router.post('/login', function(req, res, next){

    try{

        if(!req.body.email) throw new Error('preencha o campo e-mail')

        if(!req.body.password) throw new Error('preencha o campo senha')

        users.login(req.body.email, req.body.password)
            .then(user => {

                req.session.user = user

                res.redirect('/admin')

            })
            .catch(err=>{

                users.render(req, res, err.message)

            })

    }catch(err){

        users.render(req, res, err.message)

    }

})

router.get('/contacts', function(req, res, next){

    res.render('admin/contacts', {

    });

});

router.get('/emails', function(req, res, next){

    res.render('admin/emails', {

    });

});

router.get('/menus', function(req, res, next){

    res.render('admin/menus', {

    });

});

router.get('/reservations', function(req, res, next){

    res.render('admin/reservations', {
        date:{}
    });

});

router.get('/users', function(req, res, next){

    res.render('admin/users', {

    });

});

module.exports = router;