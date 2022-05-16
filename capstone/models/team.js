/*
============================================
; Title:        team.js
; Author:       David Rachwalik
; Date:         2022/05/15
; Description:  Model for Team documents
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  firstName: String,
  lastName: String,
  salary: Number,
});

const teamSchema = new Schema({
  name: String,
  mascot: String,
  players: [playerSchema],
});

module.exports = mongoose.model('Team', teamSchema);
