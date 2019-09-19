const xss = require('xss');

const ColorService = {
  getAll(db) {
    return db('color').select('*');
  },
  serialize(color) {
    return { id: color.id, color_name: xss(color.color_name) };
  }
};

module.exports = ColorService;
