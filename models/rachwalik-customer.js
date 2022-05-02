/*
============================================
; Title:        rachwalik-customer.js
; Author:       David Rachwalik
; Date:         2022/05/01
; Description:  Model for Customer documents
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let lineItemSchema = new Schema({
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
});

let invoice = new Schema({
  subtotal: { type: Number },
  tax: { type: Number },
  dateCreated: { type: String },
  dateShipped: { type: String },
  lineItems: [lineItemSchema],
});

let customerSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  invoices: [invoice],
});

module.exports = mongoose.model('Customer', customerSchema);
