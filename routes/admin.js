var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Groups = require('./../models/groups');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/home', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});

router.get('/faculties', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
        .then(function(users) {
          res.render('admin/faculties', { layout: 'admin', users: users });
        })
  } else {
    res.redirect('/')
  }
});

router.get('/faculty-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/faculty_create', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});

router.post('/faculty-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create', req.body);
    User.create(req.body)
        .then(function(user) {
          res.redirect('/admin/faculties');
        });
  } else {
    res.redirect('/')
  }
})

router.get('/students', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('student')
        .then(function(users) {
          res.render('admin/students', { layout: 'admin', users: users });
        })
  } else {
    res.redirect('/')
  }
});

router.get('/student-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/student_create', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});
router.post('/student-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create', req.body);
    User.create(req.body)
        .then(function(user) {
          res.redirect('/admin/students');
        });
  } else {
    res.redirect('/')
  }
})


router.get('/classes', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Class.list()
      .then((classes) => {
        console.log('classes', classes)
        res.render('admin/classes', { layout: 'admin', classes: classes });
      })
  } else {
    res.redirect('/')
  }
});
router.get('/class/:classId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Class.getById(req.params.classId)
      .then((classData) => {
        console.log('class', classData)
        User.noClassList('student')
          .then((allStudents) => {
            Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
              res.render('admin/class_detail', { layout: 'admin', classData: classData, allStudents: allStudents, classStudents: classStudents });
            })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/class-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
      .then((users) => {
        res.render('admin/class_create', { layout: 'admin', faculties: users });
      })
  } else {
    res.redirect('/')
  }
});

router.post('/class-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create class', req.body);
    Class.create(req.body).then((createdClass) => {
      res.redirect('/admin/classes')
    });
  } else {
    res.redirect('/')
  }
});

//groups

router.get('/groups', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Groups.list()
      .then((groups) => {
        console.log('groups', groups)
        res.render('admin/groups', { layout: 'admin', groups: groups });
      })
  } else {
    res.redirect('/')
  }
});
router.get('/groups/:groupId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Groups.getById(req.params.groupId)
      .then((groupData) => {
        console.log('groups', groupData)
        User.noClassList('student')
          .then((allStudents) => {
            Groups.getStudentsByClassId(req.params.groupId).then((groupStudents)=> {
              res.render('admin/group_detail', { layout: 'admin', groupData: groupData, allStudents: allStudents, groupStudents: groupStudents });
            })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/groups-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
      .then((users) => {
        res.render('admin/groups_create', { layout: 'admin', faculties: users });
      })
  } else {
    res.redirect('/')
  }
});

router.post('/groups-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create group', req.body);
    Groups.create(req.body).then((createdGroup) => {
      res.redirect('/admin/groups')
    });
  } else {
    res.redirect('/')
  }
})

module.exports = router;
