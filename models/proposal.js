const db = require('./../db');

var Proposal = {
  
  countApproved: () => {
    const query = `
      SELECT COUNT (ps.proposal_id),p.proposal_id,p.title,p.timestamp
       FROM "proposalStatus" ps
       INNER JOIN proposal p 
         ON ps.proposal_id = p.proposal_id
       WHERE ps.status = 'f'
       GROUP BY p.proposal_id
       ORDER BY p.timestamp DESC
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

  notApprovedList: (facultyId) => {
    //delete data from proposalStatus after approved

    const query = `
      SELECT DISTINCT p.proposal_id,p.title,p.timestamp
      FROM proposal p
      LEFT JOIN "proposalStatus" ps
      ON ps.proposal_id = p.proposal_id
      WHERE p.proposal_id NOT IN (SELECT DISTINCT proposal_id FROM "proposalStatus")
      OR ps.faculty_id != ${facultyId}
            
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
        *
      FROM proposal
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
        INSERT INTO proposal (title)
        VALUES (
          '${data.title}'
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
  
  approvedProposal: (proposalId, studentIds) => {
    const promise = new Promise((resolve, reject) => {

      var query = `
        INSERT INTO "proposalStatus"(proposal_id, faculty_id)
        VALUES ('${proposalId}','${studentIds}')
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
module.exports = Proposal;
