var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Groups = require('./../models/groups');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Class.getByStudentId(req.user.id).then(function(data) {
      console.log('data student', data)
      Groups.getByStudentId(req.user.id).then((groupStudents)=> {
      	console.log('group',groupStudents);
      res.render('student/home', { layout: 'student', user: data, group: groupStudents });
     })
    })
  } else {
    res.redirect('/')
  }
});


router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
     Class 
  } else {
    res.redirect('/')
  }
});

module.exports = router;
