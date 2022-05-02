/*
============================================
; Title:        rachwalik-node-shopper-routes.js
; Author:       David Rachwalik
; Date:         2022/05/01
; Description:  API Routes for Customer documents
;===========================================
*/

const express = require('express');
const router = express.Router();
const Customer = require('../models/rachwalik-customer');

// operations: createCustomer, creatInvoiceByCustomerName, findAllInvoicesByCustomerName

/**
 * createCustomer
 * @openapi
 * /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     name: createCustomer
 *     description: API for adding a new customer document
 *     summary: Creates a new customer
 *     requestBody:
 *       description: Customer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - userName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Customer added to MongoDB
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/customers', async (req, res) => {
  try {
    const newCustomer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
    };

    await Customer.create(newCustomer, function (err, registeredCustomer) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(registeredCustomer);
        res.json(registeredCustomer);
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
 * creatInvoiceByCustomerName
 * @openapi
 * /api/customers/:username/invoices:
 *   post:
 *     tags:
 *       - Customers
 *     name: creatInvoiceByCustomerName
 *     description: API for adding a new customer invoice document
 *     summary: Creates a new customer invoice
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username to filter by
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Customer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - subtotal
 *               - tax
 *               - dateCreated
 *               - dateShipped
 *             properties:
 *               subtotal:
 *                 type: string
 *               tax:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *               dateShipped:
 *                 type: string
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: string
 *                     quantity:
 *                       type: string
 *     responses:
 *       '200':
 *         description: Customer invoice document added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/customers/:username/invoices', async (req, res) => {
  try {
    Customer.findOne({ username: req.params.username }, function (err, customer) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(customer);
        if (customer) {
          const newInvoice = {
            subtotal: req.body.subtotal,
            tax: req.body.tax,
            dateCreated: req.body.dateCreated,
            dateShipped: req.body.dateShipped,
            lineItems: req.body.lineItems,
          };
          customer.invoices.push(newInvoice);

          customer.save((err, registeredCustomer) => {
            if (err) {
              console.log(err);
              res.status(501).send({
                message: `MongoDB Exception: ${err}`,
              });
            } else {
              console.log(registeredCustomer);
              res.json(registeredCustomer);
            }
          });
        } else {
          console.log('Invalid username: customer not found');
          res.status(401).send({
            message: `Invalid username: customer not found`,
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
 * findAllInvoicesByUserName
 * @openapi
 * /api/customers/:username/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     name: findAllInvoicesByUserName
 *     description: API for finding a customer invoice document
 *     summary: Finds a customer invoice
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username to filter by
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Customer invoice document
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/customers/:username/invoices', async (req, res) => {
  try {
    Customer.findOne({ username: req.params.username }, function (err, customer) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(customer);
        res.json(customer);
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
