/*
============================================
; Title:        rachwalik-session-routes.js
; Author:       David Rachwalik
; Date:         2022/04/24
; Description:  API Routes for User documents
;===========================================
*/

const express = require('express');
const router = express.Router();
const User = require('../models/rachwalik-user');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// operations: signup, login

/**
 * signup
 * @openapi
 * /api/signup:
 *   post:
 *     tags:
 *       - Users
 *     name: signup
 *     description: API for adding a new user document to MongoDB Atlas
 *     summary: Creates a new user document
 *     requestBody:
 *       description: User information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - Password
 *             properties:
 *               userName:
 *                 type: string
 *               Password:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registered user
 *       '401':
 *         description: Username is already in use
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/signup', async (req, res) => {
  try {
    User.findOne({ userName: req.body.userName }, function (err, user) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(user);
        if (!user) {
          let hashedPassword = bcrypt.hashSync(req.body.Password, saltRounds);
          const newRegisteredUser = {
            userName: req.body.userName,
            Password: hashedPassword,
            emailAddress: req.body.emailAddress,
          };

          user.create(newRegisteredUser, (err, registeredUser) => {
            if (err) {
              console.log(err);
              res.status(501).send({
                message: `MongoDB Exception: ${err}`,
              });
            } else {
              console.log(registeredUser);
              res.json(registeredUser);
            }
          });
        } else {
          console.log('Invalid userName: already in use');
          res.status(401).send({
            message: `Username is already in use`,
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

/**
 * login
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Users
 *     name: login
 *     description: API for logging a user into MongoDB Atlas
 *     summary: Login a user
 *     requestBody:
 *       description: User login information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - Password
 *             properties:
 *               userName:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 *       '401':
 *         description: Invalid username and/or password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/login', async (req, res) => {
  try {
    User.findOne({ userName: req.body.userName }, function (err, user) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(user);
        if (user) {
          let passwordIsValid = bcrypt.compareSync(req.body.Password, user.Password);
          if (passwordIsValid) {
            res.status(200).send({
              message: 'Login password is valid',
            });
          } else {
            console.log('Invalid password');
            res.status(401).send({
              message: `Invalid password`,
            });
          }
        } else {
          console.log('Invalid password');
          res.status(401).send({
            message: `Invalid password`,
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

module.exports = router;
