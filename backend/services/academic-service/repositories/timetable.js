// src/repositories/timetable.js
const { Timetable } = require("..//src/models");

class TimetableRepository {
  async create(data) {
    return Timetable.create(data);
  }

  async findAll() {
    return Timetable.findAll();
  }

  async findById(id) {
    return Timetable.findByPk(id);
  }

  async update(id, data) {
    return Timetable.update(data, { where: { id } });
  }

  async delete(id) {
    return Timetable.destroy({ where: { id } });
  }
}

module.exports = new TimetableRepository();