var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Groups = require('./../models/groups');
const Proposal = require('./../models/proposal');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    res.render('faculty/home', { layout: 'faculty' });
  } else {
    res.redirect('/')
  }
});

router.get('/classes', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.listByFacultyId(req.user.id)
      .then((classes) => {
        console.log('classes', classes)
        res.render('faculty/classes', { layout: 'faculty', classes: classes });
      })
  } else {
    res.redirect('/')
  }
});


router.get('/class/:classId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.getById(req.params.classId).then((classData) => {
        Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
          res.render('faculty/class_detail', { layout: 'faculty', classData: classData, classStudents: classStudents });
        })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/groups', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Groups.list()
      .then((groups) => {
        console.log('groups', groups)
        res.render('faculty/groups', { layout: 'faculty', groups: groups });
      })
  } else {
    res.redirect('/')
  }
});
router.get('/groups/:groupId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Groups.getById(req.params.groupId)
      .then((groupData) => {
        console.log('groups', groupData)
        User.noGroupList('student')
          .then((allStudents) => {
            Groups.getStudentsByClassId(req.params.groupId).then((groupStudents)=> {
              res.render('faculty/group_details', { layout: 'faculty', groupData: groupData, allStudents: allStudents, groupStudents: groupStudents });
            })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/proposal', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Proposal.countApproved().then((proposal) =>{
    res.render('faculty/proposal' ,{ layout: 'faculty',  proposal: proposal });
    })

  } else {
    res.redirect('/')
  }
});

router.get('/proposal_new', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Proposal.notApprovedList(req.user.id).then((proposal) =>{
    res.render('faculty/proposal_new' ,{ layout: 'faculty',  proposal: proposal });
    })

  } else {
    res.redirect('/')
  }
});


module.exports = router;
