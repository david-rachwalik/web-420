/*
============================================
; Title:        rachwalik-composer.js
; Author:       David Rachwalik
; Date:         2022/04/10
; Description:  Model for Composer documents
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let composerSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
});

module.exports = mongoose.model('Composer', composerSchema);
