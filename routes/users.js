'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const humps = require('humps');
const knex = require('../knex.js');
const saltRounds = 10;
// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/users", (req,res,next) => {

  knex.max('id').from('users').then(result => {
    let user = Object.assign({}, req.body);
    user.id = result[0].max +1;
    user.hashed_password = bcrypt.hashSync(user.password, saltRounds);
    delete user.password;
    knex('users').insert(humps.decamelizeKeys(user)).then(response => {
      delete user.hashed_password;
      res.send(user);
    });
  });
});

module.exports = router;
