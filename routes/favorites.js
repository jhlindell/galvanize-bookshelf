'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const knex = require('../knex.js');
const humps = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.use(bodyParser.json());

router.use('/favorites', (req,res,next) => {
  let token = req.cookies.token;
  if(!token){
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_KEY, function (err,decode) {
    if(err){
      res.clearCookie('token');
      console.log(err);
      return next(err);
    } else {
      req.user = decode;
      next();
    }
  });
});

router.get('/favorites', (req,res,next) => {
  knex('favorites').select('favorites.id', 'favorites.book_id as bookId', 'favorites.user_id as userId', 'books.created_at as createdAt', 'books.updated_at as updatedAt', 'books.title', 'books.author', 'books.genre', 'books.description', 'books.cover_url as coverUrl')
  .innerJoin('books', 'favorites.book_id', '=', 'books.id')
  .innerJoin('users', 'favorites.user_id', '=', 'users.id')
  .then(result => {
    res.send(result);
  });
});

router.get('/favorites/check', (req,res,next) => {
  let queryId = req.query.bookId;
  knex('favorites').select()
  .where('favorites.id', '=', req.query.bookId)
  .then(result => {
    if(result.length === 1){
      return res.send(true);
    }else {
      return res.send(false);
    }
  });
});

router.delete('/favorites', (req, res, next) => {
  let query = req.body.bookId;
  knex('favorites').select('favorites.id as bookId', 'users.id as userId')
  .innerJoin('users', 'favorites.user_id', '=', 'users.id')
  .where('favorites.id', '=', query)
  .then(result => {
    return res.send(result[0]);
  });
});

router.post('/favorites', (req, res, next) => {
  let token = jwt.verify(req.cookies.token, process.env.JWT_KEY);
  let object = {};
  object.book_id = req.body.bookId;
  object.user_id = token.id;
  knex('favorites')
  .returning('*')
  .insert(object)
  .then((result) => {
      let returnedObject = humps.camelizeKeys(result[0]);
      delete returnedObject.createdAt;
      delete returnedObject.updatedAt;
      res.setHeader('Content-Type', 'application/json');
      return res.send(returnedObject);
  })
  .catch((err) => {
    if(err){
      console.log(err);
      return res.sendStatus(401);
    }
  });
});

module.exports = router;
