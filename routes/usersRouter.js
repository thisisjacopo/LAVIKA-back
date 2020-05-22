const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const User = require('../models/User');
const uploadCloud = require('../config/cloudinary');
const createError = require('http-errors')


router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }
  res.redirect('/auth/login');
});


router.get('/', function (req, res, next) {
  let query = { user: req.session.currentUser._id }
  let user1;
  User.findById(req.session.currentUser._id)
    .populate('songs')
      .then(user => {
        res
        .status(201)
        .json(user)
    })
    .catch(error => console.log(error));
});



router.put('/', uploadCloud.single('photo'), async (req, res, next) => {
  const {username, email, imgPath} = req.body;

  try{
  const user = await User.findByIdAndUpdate({_id: req.session.currentUser._id},
    {$set: {username, email, imgPath}},
    {new: true}
    )
    res
    .status(200)
    .json(user)
  } catch(err) {
    next(createError(err))
}
})



module.exports = router;