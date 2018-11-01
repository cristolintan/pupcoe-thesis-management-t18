var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Groups = require('./../models/groups');
const Proposal = require('./../models/proposal');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Class.getByStudentId(req.user.id).then(function(data) {
      console.log('data student', data)
      Groups.getByStudentId(req.user.id).then((groupStudents)=> {
      	console.log('groups',groupStudents);
        Groups.getMembersByStudentId(req.user.id).then((membersStudents)=> {
          console.log('members',membersStudents);
        res.render('student/home', { layout: 'student', user: data, group: groupStudents, members: membersStudents });
       })
     })
    })
  } else {
    res.redirect('/')
  }
});

router.get('/groups', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Groups.getByStudentId(req.user.id).then((groupStudents)=> {
        console.log('groups',groupStudents);
        Groups.getMembersByStudentId(req.user.id).then((membersStudents)=> {
          console.log('members',membersStudents);
        res.render('student/group_detail', { layout: 'student', groupData: groupStudents, members: membersStudents });
       })
     })
    
  } else {
    res.redirect('/')
  }
});

router.get('/proposal', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Proposal.list().then((proposal) =>{
     Proposal.countApproved().then((approved) =>{
      console.log('approved',approved);
      res.render('student/proposal' ,{ layout: 'student',  proposal: proposal, approved: approved });
       })
    })

  } else {
    res.redirect('/')
  }
});

router.get('/proposal-status', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Proposal.list().then((proposal) =>{
     Proposal.countApproved().then((approved) =>{
      console.log('approved',approved);
      res.render('student/proposalStatus' ,{ layout: 'student',  proposal: proposal, approved: approved });
       })
    })

  } else {
    res.redirect('/')
  }
});

router.get('/proposal-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {

    res.render('student/proposal-create' ,{ layout: 'student'});   
  } else {
    res.redirect('/')
  }
});

router.post('/proposal-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    console.log('loading');
    Proposal.create(req.body).then((createdProposal) => {
    res.redirect('/student/proposal')
    });   
  } else {
    res.redirect('/')
  }
});

module.exports = router;
