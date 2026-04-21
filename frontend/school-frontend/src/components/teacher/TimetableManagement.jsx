import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';

const TimetableManagement = () => {
  const [timetables, setTimetables] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [formData, setFormData] = useState({
    gradeId: '',
    subjectId: '',
    day: '',
    startTime: '',
    endTime: '',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [timetablesData, subjectsData, classesData] = await Promise.all([
        academicService.getAllTimetables().catch(err => {
          console.error('Error fetching timetables:', err);
          return [];
        }),
        academicService.getAllSubjects().catch(err => {
          console.error('Error fetching subjects:', err);
          return [];
        }),
        schoolService.getAllClasses().catch(err => {
          console.error('Error fetching classes:', err);
          return [];
        })
      ]);
      
      setTimetables(timetablesData);
      setSubjects(subjectsData);
      setClasses(classesData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTimetable) {
        await academicService.updateTimetable(editingTimetable.id, formData);
      } else {
        await academicService.createTimetable(formData);
      }
      
      setShowForm(false);
      setEditingTimetable(null);
      setFormData({
        gradeId: '',
        subjectId: '',
        day: '',
        startTime: '',
        endTime: '',
        room: ''
      });
      await loadData();
    } catch (err) {
      console.error('Error saving timetable:', err);
    }
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
    setFormData({
      gradeId: timetable.gradeId,
      subjectId: timetable.subjectId,
      day: timetable.day,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      room: timetable.room
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      try {
        await academicService.deleteTimetable(id);
        await loadData();
      } catch (err) {
        console.error('Error deleting timetable:', err);
      }
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  const getClassName = (gradeId) => {
    const classItem = classes.find(c => c.id === gradeId);
    return classItem ? `${classItem.name} - ${classItem.section}` : 'Unknown';
  };

  
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading timetable data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1f2937' }}>Timetable Management</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Timetable Entry
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>
                {editingTimetable ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTimetable(null);
                  setFormData({
                    gradeId: '',
                    subjectId: '',
                    teacherId: '',
                    day: '',
                    startTime: '',
                    endTime: '',
                    room: ''
                  });
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Class/Grade:</label>
                <select
                  value={formData.gradeId}
                  onChange={(e) => setFormData({...formData, gradeId: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Subject:</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Day:</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Start Time:</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>End Time:</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Room:</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTimetable(null);
                    setFormData({
                      gradeId: '',
                      subjectId: '',
                      teacherId: '',
                      day: '',
                      startTime: '',
                      endTime: '',
                      room: ''
                    });
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={16} />
                  {editingTimetable ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Class</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Subject</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Day</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Time</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Room</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Calendar size={48} style={{ margin: '0 auto', opacity: 0.5 }} />
                  </div>
                  <div>No timetable entries found</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>Add your first timetable entry to get started</div>
                </td>
              </tr>
            ) : (
              timetables.map((timetable) => (
                <tr key={timetable.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{getClassName(timetable.gradeId)}</td>
                  <td style={{ padding: '12px' }}>{getSubjectName(timetable.subjectId)}</td>
                                    <td style={{ padding: '12px' }}>{timetable.day}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {timetable.startTime} - {timetable.endTime}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>{timetable.room || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(timetable)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(timetable.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableManagement;
