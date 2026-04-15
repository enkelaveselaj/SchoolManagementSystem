
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp
} from 'lucide-react';

import schoolService from '../services/schoolService';
import './ClassManagement.css';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    academicYearId: '',
    gradeLevel: '',
    section: '',
    name: '',
    capacity: 30
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [filterGradeLevel, setFilterGradeLevel] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesData, yearsData] = await Promise.all([
        schoolService.getAllClasses(),
        schoolService.getAllAcademicYears()
      ]);

      setClasses(classesData);
      setAcademicYears(yearsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.academicYearId) newErrors.academicYearId = 'Required';
    if (!formData.gradeLevel) newErrors.gradeLevel = 'Required';
    if (!formData.section) newErrors.section = 'Required';
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = 'Invalid capacity';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        academicYearId: parseInt(formData.academicYearId),
        gradeLevel: parseInt(formData.gradeLevel),
        capacity: parseInt(formData.capacity)
      };

      if (editingClass) {
        await schoolService.updateClass(editingClass.id, payload);
      } else {
        await schoolService.createClass(payload);
      }

      await loadData();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      academicYearId: '',
      gradeLevel: '',
      section: '',
      name: '',
      capacity: 30
    });

    setEditingClass(null);
    setErrors({});
  };

  const filtered = classes.filter(c =>
    (!searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filterAcademicYear || c.academicYearId.toString() === filterAcademicYear) &&
    (!filterGradeLevel || c.gradeLevel.toString() === filterGradeLevel)
  );

  const handleEdit = (classData) => {
    setEditingClass(classData);
    setFormData({
      academicYearId: classData.academicYearId.toString(),
      gradeLevel: classData.gradeLevel.toString(),
      section: classData.section,
      name: classData.name,
      capacity: classData.capacity
    });
    setShowForm(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await schoolService.deleteClass(classId);
        await loadData();
      } catch (err) {
        console.error('Error deleting class:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  };

  return (
    <div className="class-management">

      <div className="academic-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <BookOpen size={32} />
            </div>
            <div className="header-text">
              <h1>Class Management</h1>
              <p>Manage all classes, sections, and student enrollment</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-enhanced" onClick={() => setShowForm(true)}>
              <Plus size={18} /> Add Class
            </button>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              className="search-input"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-section">
          <select
            className="filter-btn"
            value={filterAcademicYear}
            onChange={(e) => setFilterAcademicYear(e.target.value)}
          >
            <option value="">All Years</option>
            {academicYears.map(year => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
          <select
            className="filter-btn"
            value={filterGradeLevel}
            onChange={(e) => setFilterGradeLevel(e.target.value)}
          >
            <option value="">All Grades</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      
      <div className="content-section">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">
                <BookOpen size={40} />
              </div>
              <div className="empty-text">
                <h3>No Classes Found</h3>
                <p>Start by adding your first class or adjust your search filters.</p>
                <button className="btn-enhanced" onClick={() => setShowForm(true)}>
                  <Plus size={18} /> Add First Class
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="academic-grid">
            {filtered.map(c => (
              <div key={c.id} className="academic-card">
                <div className="card-header">
                  <div className="card-title">{c.name}</div>
                  <div className="card-subtitle">Grade {c.gradeLevel} - Section {c.section}</div>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => handleEdit(c)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="class-details">
                    <div className="detail-item">
                      <Users className="detail-icon" size={16} />
                      <span>{c.capacity} Students Capacity</span>
                    </div>
                    <div className="detail-item">
                      <GraduationCap className="detail-icon" size={16} />
                      <span>Grade {c.gradeLevel} - Section {c.section}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar className="detail-icon" size={16} />
                      <span>{academicYears.find(y => y.id === c.academicYearId)?.name || 'Unknown Year'}</span>
                    </div>
                    <div className="detail-item">
                      <div className="status active">
                        <span className="dot"></span>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-enhanced">
            <div className="modal-header">
              <h2 className="modal-title">{editingClass ? 'Edit' : 'Add'} Class</h2>
              <button className="btn-close" onClick={() => {
                setShowForm(false);
                resetForm();
              }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Academic Year</label>
                <select
                  value={formData.academicYearId}
                  onChange={(e) => setFormData({...formData, academicYearId: e.target.value})}
                  required
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics 101"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                  required
                >
                  <option value="">Select Grade</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <input
                  type="text"
                  placeholder="e.g., A, B, C"
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  placeholder="Maximum number of students"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingClass ? 'Update' : 'Create')} Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassManagement;
