const db = require('./../db');

var Groups = {
  getById: (id) => {
    const query = `
      SELECT
        c.id,
        c.name,
        u.id as adviser_id,
        u.first_name as adviser_first_name,
        u.last_name as adviser_last_name
      FROM groups c
      INNER JOIN users u on c.adviser = u.id
      WHERE c.id = ${id}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows[0]);
        } else {
          resolve(null);
        }
      });
    });
    return promise;
  },

  getByStudentId: (studentId) => {
    const query = `
      SELECT 
        cl.name,
        u.first_name ,
        u.last_name,
        u.email,
        us.first_name as adviser_fname,
        us.last_name as adviser_lname,
        us.email as adviser_email
      FROM "group_members" c
      INNER JOIN groups cl on c.group_id = cl.id
      INNER JOIN users u on c.members_id = u.id
      INNER JOIN users us on cl.adviser = us.id
      WHERE c.members_id = ${studentId}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        console.log('getByStudentId', data.rows);
        if (data && data.rowCount) {
          resolve(data.rows[0]);
        } else {
          resolve(null);
        }
      });
    });
    return promise;
  },
  getStudentsByClassId: (groupId) => {
    const query = `
      SELECT *
      FROM "group_members" c
      INNER JOIN users u on c.members_id = u.id
      WHERE c.group_id = ${groupId}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  getMembersByStudentId: (studentId) => {
    const query = `
      SELECT *
      FROM "group_members" c
      INNER JOIN users u on c.members_id = u.id
      INNER JOIN groups g on c.group_id = g.id
      WHERE c.group_id = (SELECT group_id from group_members WHERE members_id = ${studentId})
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  //displayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
  list: (filter) => {
    const query = `
      SELECT
        g.id,
        g.name,
        u.id as adviser_id,
        u.first_name as adviser_first_name,
        u.last_name as adviser_last_name
      FROM groups g
      INNER JOIN users u on g.adviser = u.id
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  listByFacultyId: (facultyId) => {
    const query = `
      SELECT
        id,
        name,
        section
      FROM groups 
      WHERE adviser=${facultyId}
    `;
    var promise = new Promise((resolve, reject) => {
      console.log('query', query)
      db.query(query, (req, data) => {
        console.log('req', req)
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  create: (data) => {
    // check first if user with given email already exists
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO groups(name,adviser)
        VALUES (
          '${data.name}',
          '${data.adviser}'
        )
        RETURNING *
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },
  
  addStudents: (groupId, studentIds) => {
    console.log('addStudents', groupId, studentIds);
    const promise = new Promise((resolve, reject) => {

      var values = [];
      studentIds.forEach((studentId) => {
        values.push(`('${groupId}', '${studentId}')`)
      })
      var query = `
        INSERT INTO "group_members"(group_id, members_id)
        VALUES ${values.join(',')}
        RETURNING *
      `;
      console.log('query', query);
      db.query(query, (req, data) => {
        console.log('added', req, data);
        resolve(data.rows);
      });
    });
    return promise;
  }
};
module.exports = Groups;
