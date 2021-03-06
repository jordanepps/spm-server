const xss = require('xss');

const MakeService = {
  getAll(db) {
    return db('make').select('*');
  },
  getById(db, id) {
    return db('make')
      .where({ id })
      .first();
  },
  insert(db, make_name) {
    return db('make')
      .insert(make_name)
      .returning('*')
      .then(([make]) => make);
  },
  update(db, id, make_name) {
    return db('make')
      .where({ id })
      .update(make_name);
  },
  hasMake(db, make_name) {
    return db('make')
      .where({ make_name })
      .first();
  },
  deleteMake(db, id) {
    return db('make')
      .where({ id })
      .delete();
  },
  serialize(make) {
    return { id: make.id, make_name: xss(make.make_name) };
  }
};

module.exports = MakeService;
