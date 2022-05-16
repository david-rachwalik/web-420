/*
============================================
; Title:        team-routes.js
; Author:       David Rachwalik
; Date:         2022/05/15
; Description:  API Routes for Team documents
;===========================================
*/

const express = require('express');
const router = express.Router();
// models
const Team = require('../models/team');

// operations: createTeam, findAllTeams, deleteTeamById, assignPlayerToTeam, findAllPlayersByTeamId, deleteTeamPlayerById

/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     name: createTeam
 *     description: API for adding a new team document in MongoDB.
 *     summary: Creates a new team
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - mascot
 *             properties:
 *               name:
 *                 type: string
 *               mascot:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams', async (req, res) => {
  try {
    const newTeam = {
      name: req.body.name,
      mascot: req.body.mascot,
    };

    // https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne
    // https://www.mongodb.com/docs/manual/reference/operator/update/set
    Team.updateOne(
      { name: newTeam.name },
      { $set: { mascot: newTeam.mascot } },
      { upsert: true },
      (callback = function (err, team) {
        if (err) {
          console.log(err);
          res.status(501).send({
            message: `MongoDB Exception: ${err}`,
          });
        } else {
          console.log(team);
          if (team) {
            // https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne
            Team.findOne({ name: newTeam.name }, { __v: 0 }, function (err, team) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  message: `MongoDB Exception: ${err}`,
                });
              } else {
                console.log(team);
                res.json(team);
              }
            });
          } else {
            console.log('Invalid teamId');
            res.status(401).send({
              message: `Invalid teamId`,
            });
          }
        }
      }),
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     name: findAllTeams
 *     description: API for returning an array of team documents in MongoDB.
 *     summary: Returns all teams
 *     responses:
 *       '200':
 *         description: Array of team documents
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/teams', async (req, res) => {
  try {
    Team.find({}, function (err, teams) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(teams);
        res.json(teams);
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
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeamById
 *     description: API for deleting a team document in MongoDB.
 *     summary: Removes a team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete('/teams/:id', async (req, res) => {
  try {
    Team.findByIdAndDelete({ _id: req.params.id }, function (err, team) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(team);
        if (team) {
          res.json(team);
        } else {
          console.log('Invalid teamId');
          res.status(401).send({
            message: `Invalid teamId`,
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
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     name: assignPlayerToTeam
 *     description: API for adding a new team player document in MongoDB.
 *     summary: Adds a team player
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Player information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams/:id/players', async (req, res) => {
  try {
    const newPlayer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salary: req.body.salary,
    };

    // https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne
    // https://www.mongodb.com/docs/manual/reference/operator/update/push
    // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet
    Team.updateOne(
      { _id: req.params.id },
      { $addToSet: { players: newPlayer } },
      (callback = function (err, team) {
        if (err) {
          console.log(err);
          res.status(501).send({
            message: `MongoDB Exception: ${err}`,
          });
        } else {
          console.log(team);
          if (team) {
            Team.findOne({ _id: req.params.id }, { __v: 0 }, function (err, team) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  message: `MongoDB Exception: ${err}`,
                });
              } else {
                console.log(team);
                if (team) {
                  // Return newly added player
                  let player = team.players.find((p) => p.firstName === newPlayer.firstName && p.lastName === newPlayer.lastName);
                  console.log(player);
                  res.json(player);
                } else {
                  console.log('Invalid teamId');
                  res.status(401).send({
                    message: `Invalid teamId`,
                  });
                }
              }
            });
          } else {
            console.log('Invalid teamId');
            res.status(401).send({
              message: `Invalid teamId`,
            });
          }
        }
      }),
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning a group of team player documents in MongoDB.
 *     summary: Returns all team players
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of player documents
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/teams/:id/players', async (req, res) => {
  try {
    Team.findOne({ _id: req.params.id }, { __v: 0 }, function (err, team) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(team);
        if (team) {
          res.json(team.players);
        } else {
          console.log('Invalid teamId');
          res.status(401).send({
            message: `Invalid teamId`,
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
 * deleteTeamPlayerById
 * @openapi
 * /api/teams/{id}/players/{pid}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeamPlayerById
 *     description: API for deleting a team player document in MongoDB.
 *     summary: Removes a team player
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         required: true
 *         description: Team Player document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid teamId or playerId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete('/teams/:id/players/:pid', async (req, res) => {
  try {
    // https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne
    // https://www.mongodb.com/docs/manual/reference/operator/update/pull
    Team.updateOne(
      { _id: req.params.id },
      { $pull: { players: { _id: req.params.pid } } },
      (callback = function (err, team) {
        if (err) {
          console.log(err);
          res.status(501).send({
            message: `MongoDB Exception: ${err}`,
          });
        } else {
          console.log(team);
          if (team) {
            res.json(team);
          } else {
            console.log('Invalid teamId');
            res.status(401).send({
              message: `Invalid teamId`,
            });
          }
        }
      }),
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

module.exports = router;
