var express = require('express');
var admin = require('../inc/admin.mysql');
var router = express.Router();
var users = require('../inc/users');
var menus = require('../inc/menus.mysql');
var reservations = require('../inc/reservations');
var moment = require('moment');
var contacts = require('../inc/contacts');
var emails = require('../inc/emails');



module.exports = function(io){
    
    moment.locale('pt-BR');
    
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
    
    router.get('/dashboard', function(req, res, next){
    
        reservations.dashboard()
            .then(data => {
    
                res.send(data);
    
            })
    
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
    
        contacts.getContacts()
            .then(data => {
    
                res.render('admin/contacts', admin.getParams(req, {data}));
            })
            .catch(err => res.send(err));
    
    
    
    });
    
    router.delete('/contacts/:id', function(req, res, next){
    
        contacts.delete(req.params.id)
            .then(results => {
    
                res.send(results);
                
                io.emit('dashboard update');
            })
            .catch(err => {
                console.error(err);
                res.send(err);
            });
    
    });
    
    router.get('/emails', function(req, res, next){
    
        emails.getEmails()
            .then(data => {
    
                res.render('admin/emails', admin.getParams(req, {data}));
    
            });
    
    
    });
    router.delete('/emails/:id', function(req, res, next){
    
        emails.delete(req.params.id)
            .then(results => {
    
                res.send(results);
                
                io.emit('dashboard update');
            })
            .catch(err => {
                console.error(err);
                res.send(err);
            });
    
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
    
        menus.save(req.fields, req.files)
            .then(results => {
                res.send(results);
            
                io.emit('dashboard update');
            })
            .catch(err => {
                console.error(err);
            });
    
    });
    
    router.delete('/menus/:id', function(req, res, next){
    
        menus.delete(req.params.id)
            .then(results => {
    
                res.send(results);
    
                io.emit('dashboard update');
            })
            .catch(err => {
    
                res.send(err);
    
            })
    
    });
    
    router.get('/reservations', function(req, res, next){
    
        let start = (req.query.start) ? req.query.start : moment().subtract(1, "year").format('YYYY-MM-DD');
        let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');
        
        reservations.getReservations(req)
        .then(pag => {
            
            res.render('admin/reservations', admin.getParams(req, {
                date:{
                    start,
                    end
                },
                data: pag.data,
                moment,
                links: pag.links
            }));
            
            })
            .catch(err => {
    
                console.error(err)
    
            })
    
    
    });
    
    router.post('/reservations', function(req, res, next){
        console.log(req.fields)
        reservations.save(req.fields)
            .then(results => {
                res.send(results)
            
                io.emit('dashboard update');
            })
            .catch(err => {
                console.error(err);
            });
    
    });
    
    router.delete('/reservations/:id', function(req, res, next){
    
        reservations.delete(req.params.id)
            .then(results => {
    
                res.send(results);
    
                io.emit('dashboard update');
            })
            .catch(err => {
    
                res.send(err);
    
            })
    
    });
    
    router.get('/reservations/chart', function(req, res, next){
    
        req.query.start = (req.query.start) ?
            req.query.start
            : moment().subtract(1,'year').format('YYYY- MM-DD');
        req.query.end = (req.query.end) ?
            req.query.end
            : moment().format('YYYY-MM-DD');
    
        reservations.chart(req)
            .then(chartData => {
    
                res.send(chartData);
    
            })
    
    });
    
    router.get('/users', function(req, res, next){
    
        users.getUsers()
            .then(data => {
    
                res.render('admin/users', admin.getParams(req, {
                    data
                }));
    
            })
    
    });
    
    router.post('/users', function(req, res, next){
    
        users.save(req.fields)
    
            .then(results => {
                
                res.send(results);
                
                io.emit('dashboard update');
            })
            .catch( err => {
    
                res.send(err);
    
            });
    
    });
    
    router.delete('/users/:id', function(req, res, next){
        
        users.delete(req.params.id)
            .then(results => {
    
                res.send(results);
                io.emit('dashboard update');
            })
            .catch(err => {
    
                res.send(err);
    
            })
    
    });

    router.post('/users/password-change', function(req, res, next){
    
        users.changePassword(req)
            .then(results => res.send(results))
            .catch(err => res.send({error: err}));
    
    });

    return router;

}