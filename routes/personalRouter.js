const express = require('express');
const router = express.Router();
const Song = require('../models/Song.js');
const User = require('../models/user');
const uploadCloud = require('../config/cloudinary.js')


router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }
  res.redirect('/auth/login');
});


router.get('/profile', function (req, res, next) {
  let query = { user: req.session.currentUser._id }
  let user1;
  User.findById(req.session.currentUser._id)
    .then(user => user1 = user)
  Song.find(query)
    .then(Songs => res.render('personal/profile', {
      Songs,
      user1
    }))
    .catch(error => console.log(error));
});


router.post('/profile',  function (req, res, next) {
  let query = { user: req.session.currentUser._id }
  let user1;
  User.findById(req.session.currentUser._id)
  .then(user => user1 = user)
Song.find(query)
  .then(Songs => res.render('personal/edit', {
    Songs,
    user1
  }))
  .catch(error => console.log(error));
});

router.post('/:id/delete', (req, res, next) => {
  Song.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/personal/profile');
    })
    .catch(error => {
      console.log('Error while deleting', error);
    })
})


router.post('/:id/edit', uploadCloud.single('photo'), (req, res, next) => {

  let imgPath, imgName;

const {
    name,
    city,
    website
  } = req.body;

  if(req.file !== undefined){
     imgPath = req.file.url;
     imgName = req.file.originalname;
  } else{
    imgPath = req.session.currentUser.imgPath;
     imgName = req.session.currentUser.imgName;
  }
  

  User.updateOne({
      _id: req.params.id
    }, {
      $set: {
        name,
        city,
        website,
        imgPath,
        imgName
      }
    })
    .then(() => {
      res.redirect('/personal/profile');
    })
    .catch(error => {
      console.log('Error while editing', error);
    })
})

module.exports = router;