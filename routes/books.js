'use strict';

const knex = require('../knex');
const express = require('express');
const humps = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', function(req, res, next) {
  knex.select()
    .from('books')
    .orderBy('title')
    .then((result) => {
      let returnArray = [];
      for (let i = 0; i < result.length; i++) {
        let obj = {};
        for (let key in result[i]) {
          if (key === 'cover_url') {
            let humpKey = humps.camelize(key);
            obj[humpKey] = result[i][key];
          } else if (key == 'updated_at') {
            let humpKey = humps.camelize(key);
            obj[humpKey] = result[i][key];
          } else if (key == 'created_at') {
            let humpKey = humps.camelize(key);
            obj[humpKey] = result[i][key];
          } else {
            obj[key] = result[i][key];
          }
        }
        returnArray.push(obj);
      }
      res.send(returnArray);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/books/:id', function(req,res,next){
  knex.select()
    .from('books')
    .orderBy('title')
    .where('id', req.params.id)
    .then((result) => {
      let obj = {};
      for (let key in result[0]) {
        if (key === 'cover_url') {
          let humpKey = humps.camelize(key);
          obj[humpKey] = result[0][key];
        } else if (key == 'updated_at') {
          let humpKey = humps.camelize(key);
          obj[humpKey] = result[0][key];
        } else if (key == 'created_at') {
          let humpKey = humps.camelize(key);
          obj[humpKey] = result[0][key];
        } else {
          obj[key] = result[0][key];
        }
      }
      res.send(obj);
    }).catch(err => {
      next(err);
    });
});

router.post('/books', function(req,res,next){
  knex.max('id').from('books').then(function(result){
    req.body.id = result[0].max +1;
    knex('books').insert(req.body);
    res.send(req.body);
  });
});

router.patch('/books/:id', function(req,res,next){
  let obj = {};
  for(let key in req.body){
    if(key === 'coverUrl'){
      obj.key = humps.decamelize(key);
    }
    if(key === 'updatedAt'){
      obj.key = humps.decamelize(key);
    }
    if(key === 'createdAt'){
      obj.key = humps.decamelize(key);
    }
    obj[key] = req.body[key];
  }
  knex('books')
  .where('id', req.params.id)
  .update(obj);
  req.body.id = req.params.id;
  res.send(req.body);
});

router.delete('/books/:id', function(req,res,next){
  knex('books')
  .where('id', req.params.id).first()
  .then((result) => {
    knex('books').where('id', req.params.id).del()
    .then((result2) =>{
      let obj = {};
      for (let key in result) {
        if (key === 'cover_url') {
          let humpKey = humps.camelize(key);
          obj[humpKey] = result[key];
        } else if (key == 'updated_at') {
          let humpKey = humps.camelize(key);
          obj[humpKey] = result[key];
        } else if (key == 'created_at') {
          let humpKey = humps.camelize(key);
          obj[humpKey] = result[key];
        } else {
          obj[key] = result[key];
        }
      }
      delete obj.id;
      res.send(obj);
    });
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
