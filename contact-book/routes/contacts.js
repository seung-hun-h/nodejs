var express = require('express');
var router = express.Router();
var Contact = require('../models/Contact')

router.get('/', (req, res) => {
    Contact.find({}, (err, contacts) => {
        if (err) return res.json(err)
        res.render('contacts/index', {contacts:contacts});
    });
});

router.post('/', (req, res) => {
    Contact.create(req.body, (err, contact) => {
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

router.get('/:id', (req, res) => {
    Contact.findOne({_id:req.params.id}, (err, contact) => {
        if (err) return res.json(err)
        res.render('contacts/show', {contact:contact});
    })
})

router.get('/:id/edit', (req, res) => {
    Contact.findOne({_id:req.params.id}, (err, contact) => {
        if (err) return res.json(err)
        res.render('contacts/edit', {contact:contact});
    })
})

router.get('/new', (req, res) => {
    res.render('contacts/new');
});

router.put('/:id', (req, res) => {
    Contact.findOneAndUpdate({_id:req.params.id}, req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect('/contacts/'+req.params.id);
    });
});

router.delete('/:id', (req, res) => {
    Contact.findOneAndDelete({_id:req.params.id}, (err) => {
        if (err) return res.json(err);
        res.redirect('/contacts');
    })
})

module.exports = router;