var express = require('express');
var admin = require('../inc/admin.mysql');
var router = express.Router();
var users = require('../inc/users');
var menus = require('../inc/menus.mysql')


router.use(function(req, res, next){
    

    //if(!req.session.user) res.redirect('/admin/login')
    if(['/login'].indexOf(req.url) === -1 && !req.session.user) {

        res.redirect('/admin/login');
        
    } else {

        next();

    };

});

router.use(function(req , res, next){

    req.menus = admin.getMenus(req);

    next();

})

router.get('/', function(req, res, next){

    admin.dashboard()
        .then(data =>{

            res.render('admin/index', admin.getParams(req, {
                data
            }));

        })
        .catch(err => {

            console.error(err);

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

    res.render('admin/contacts', admin.getParams(req));

});

router.get('/emails', function(req, res, next){

    res.render('admin/emails', admin.getParams(req));

});

router.get('/menus', function(req, res, next){

    menus.getMenus()
        .then(data => {


            res.render('admin/menus', admin.getParams(req, {
                data
            }));

        })
        .catch(err =>{

            console.error(err)
            
        });

});

router.post('/menus', function(req, res, next){
    console.log(req.files)
    menus.save(req.fields, req.files)
        .then(results => {
            console.log(results)
        })
        .catch(err => {
            console.error(err)
        })

});

router.get('/reservations', function(req, res, next){

    res.render('admin/reservations', admin.getParams(req, {
        date: {}
    }));

});

router.get('/users', function(req, res, next){

    res.render('admin/users', admin.getParams(req));

});

module.exports = router;