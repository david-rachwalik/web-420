/*
============================================
; Title:        rachwalik-user.js
; Author:       David Rachwalik
; Date:         2022/04/24
; Description:  Model for User documents
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: { type: String },
  Password: { type: String },
  emailAddress: [],
});

module.exports = mongoose.model('User', userSchema);
