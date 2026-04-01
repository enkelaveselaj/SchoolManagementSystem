
const timetableRepo = require("../repositories/timetable");

class TimetableService {
  createTimetable(data) {
    return timetableRepo.create(data);
  }

  getAllTimetables() {
    return timetableRepo.findAll();
  }

  getTimetableById(id) {
    return timetableRepo.findById(id);
  }

  updateTimetable(id, data) {
    return timetableRepo.update(id, data);
  }

  deleteTimetable(id) {
    return timetableRepo.delete(id);
  }
}

module.exports = new TimetableService();