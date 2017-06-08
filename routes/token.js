'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const knex = require('../knex.js');
// eslint-disable-next-line new-cap
const router = express.Router();

router.use(bodyParser.json());

router.get('/token', (req, res, next) => {
  let token = req.cookies.token;
  if(!token){
    res.status(200);
    return res.send(false);
  }
  jwt.verify(token, process.env.JWT_KEY, function (err,decode) {
    if(err){
      console.log(err);
      return res.send(false);
    } else {
      res.status(200);
      return res.send(true);
    }
  });
});

router.post('/token', (req, res, next) => {
  knex('users').select('id', 'email', 'hashed_password', 'first_name', 'last_name').where('email', req.body.email).then(result => {
    if (result[0] === undefined) {
      res.status(400);
      res.setHeader('Content-Type', 'text/plain');
      return res.send('Bad email or password');
    }
    let passResult = bcrypt.compareSync(req.body.password, result[0].hashed_password);
    if (!passResult){
      res.status(400);
      res.setHeader('Content-Type', 'text/plain');
      return res.send('Bad email or password');
    } else {
      let user = {};
      user.id = result[0].id;
      user.email = result[0].email;
      user.firstName = result[0].first_name;
      user.lastName = result[0].last_name;
      if (!passResult) {
        return res.sendStatus(200, false);
      } else {
        res.cookie('token', jwt.sign(user, process.env.JWT_KEY), {httpOnly:true});
        return res.send(user);
      }
    }
  }).catch(function (err) {
    console.log(err);
  });
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token').sendStatus(200);
});

module.exports = router;
