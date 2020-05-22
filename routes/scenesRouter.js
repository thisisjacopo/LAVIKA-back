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
router.post('/', async (req, res, next) =>{
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

//ADDS URL TO CLOUDINARY
router.post('/file', uploadCloud.single('urlPath'), async (req, res, next) =>{
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    } console.log(req.file.data);
    
    //   // get secure_url from the file object and save it in the 
    //   // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    //   res.json({ secure_url: req.file.secure_url });
    try{
        res
        .status(200)
        .json({
            urlPath: req.file.secure_url
        })
    } catch(err) {
        next(createError(err))
    }
})



//DELETES ONE SONG
router.delete('/:id', async (req, res, next) =>{
    const id = req.params.id;
    try{
        const removeSong = await Song.findByIdAndDelete(id)
        res
        .status(204)
        .send()
    } catch(err) {
        next(createError(err))
    }
})

module.exports = router;    