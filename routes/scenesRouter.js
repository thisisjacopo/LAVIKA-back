const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Song = require('../models/Song');
const createError = require('http-errors')
const uploadCloud = require('../config/cloudinary')

//GETS ALL SONGS FROM ALL USERS
router.get('/', (req, res, next) =>{
    Song.find()
        .then(songs =>{
            res.json(songs)
            res.status(200)
        })
        .catch(err => next(createError(err)))
})

// POSTS A NEW SONG
router.post('/', uploadCloud.single('file'), async (req, res, next) =>{
    let {name, description, urlPath} = req.body
    let user = req.session.currentUser_id
    try{
   const song = await Song.create({name, description, urlPath, user})
   res
   .status(200)
   .json(song)
    } catch(err) {
        next(createError(err))
    }
})

router.delete('/:id', async (req, res, next) =>{
    const id = req.params.id;
    try{
        const removeSong = await Song.findByIdAndDelete(id)
        res
        .status(200)
        .json(removeSong)
    } catch(err) {
        next(createError(err))
    }
})

module.exports = router;    