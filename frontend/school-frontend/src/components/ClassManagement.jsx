import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, Users, GraduationCap, Calendar } from 'lucide-react';
import schoolService from '../services/schoolService';

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
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [filterGradeLevel, setFilterGradeLevel] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesData, academicYearsData] = await Promise.all([
        schoolService.getAllClasses(),
        schoolService.getAllAcademicYears()
      ]);
      setClasses(classesData);
      setAcademicYears(academicYearsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.academicYearId) {
      newErrors.academicYearId = 'Academic year is required';
    }
    
    if (!formData.gradeLevel) {
      newErrors.gradeLevel = 'Grade level is required';
    } else if (isNaN(formData.gradeLevel) || formData.gradeLevel < 1 || formData.gradeLevel > 12) {
      newErrors.gradeLevel = 'Grade level must be between 1 and 12';
    }
    
    if (!formData.section) {
      newErrors.section = 'Section is required';
    }
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Class name is required';
    }
    
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || formData.capacity < 1 || formData.capacity > 100) {
      newErrors.capacity = 'Capacity must be between 1 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingClass) {
        await schoolService.updateClass(editingClass.id, {
          ...formData,
          academicYearId: parseInt(formData.academicYearId),
          gradeLevel: parseInt(formData.gradeLevel),
          capacity: parseInt(formData.capacity)
        });
      } else {
        await schoolService.createClass({
          ...formData,
          academicYearId: parseInt(formData.academicYearId),
          gradeLevel: parseInt(formData.gradeLevel),
          capacity: parseInt(formData.capacity)
        });
      }
      
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      academicYearId: classItem.academicYearId.toString(),
      gradeLevel: classItem.gradeLevel.toString(),
      section: classItem.section,
      name: classItem.name,
      capacity: classItem.capacity
    });
    setShowForm(true);
  };

  const handleDelete = async (classItem) => {
    if (window.confirm(`Are you sure you want to delete ${classItem.name}?`)) {
      try {
        await schoolService.deleteClass(classItem.id);
        await loadData();
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Failed to delete class. Please try again.');
      }
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
    setErrors({});
    setEditingClass(null);
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesAcademicYear = !filterAcademicYear || classItem.academicYearId.toString() === filterAcademicYear;
    const matchesGradeLevel = !filterGradeLevel || classItem.gradeLevel.toString() === filterGradeLevel;
    return matchesAcademicYear && matchesGradeLevel;
  });

  const getAcademicYearName = (academicYearId) => {
    const year = academicYears.find(y => y.id === academicYearId);
    return year ? year.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="class-management">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title">
            <BookOpen className="page-header__icon" size={28} />
            <h1>Class Management</h1>
          </div>
          <p className="page-header__description">
            Create and manage classes across different academic years and grade levels
          </p>
        </div>
        <button 
          className="btn btn--primary btn--with-icon"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      {/* Filters */}
      <div className="page-controls">
        <div className="search-filter-group">
          <div className="filter-dropdown">
            <Calendar className="filter-dropdown__icon" size={20} />
            <select 
              value={filterAcademicYear} 
              onChange={(e) => setFilterAcademicYear(e.target.value)}
              className="filter-dropdown__select"
            >
              <option value="">All Academic Years</option>
              {academicYears.map(year => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-dropdown">
            <Filter className="filter-dropdown__icon" size={20} />
            <select 
              value={filterGradeLevel} 
              onChange={(e) => setFilterGradeLevel(e.target.value)}
              className="filter-dropdown__select"
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
        
        <div className="stats-summary">
          <span className="stats-summary__count">
            {filteredClasses.length} {filteredClasses.length === 1 ? 'Class' : 'Classes'}
          </span>
          <span className="stats-summary__total">
            Total: {classes.length} classes
          </span>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((classItem) => (
            <div key={classItem.id} className="class-card">
              <div className="class-card__header">
                <div className="class-card__title-section">
                  <h3 className="class-card__title">{classItem.name}</h3>
                  <div className="class-card__metadata">
                    <span className="class-card__grade">Grade {classItem.gradeLevel}</span>
                    <span className="class-card__section">Section {classItem.section}</span>
                  </div>
                </div>
                <div className="class-card__actions">
                  <button 
                    className="btn-icon btn-icon--edit"
                    onClick={() => handleEdit(classItem)}
                    title="Edit class"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-icon--delete"
                    onClick={() => handleDelete(classItem)}
                    title="Delete class"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="class-card__content">
                <div className="class-card__info">
                  <div className="info-item">
                    <span className="info-item__label">Academic Year</span>
                    <span className="info-item__value">
                      {getAcademicYearName(classItem.academicYearId)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-item__label">Capacity</span>
                    <span className="info-item__value">{classItem.capacity} students</span>
                  </div>
                </div>
                
                <div className="class-card__stats">
                  <div className="stat-item">
                    <Users className="stat-item__icon" size={16} />
                    <div className="stat-item__content">
                      <span className="stat-item__value">--</span>
                      <span className="stat-item__label">Enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <BookOpen className="empty-state__icon" size={48} />
            <h3 className="empty-state__title">No Classes Found</h3>
            <p className="empty-state__description">
              {filterAcademicYear || filterGradeLevel 
                ? 'No classes match your filter criteria.'
                : 'Get started by creating your first class.'}
            </p>
            {!filterAcademicYear && !filterGradeLevel && (
              <button 
                className="btn btn--primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={20} />
                Create First Class
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h2>
              <button 
                className="btn-icon btn-icon--close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal__form">
              <div className="form-group">
                <label className="form-group__label">
                  Academic Year *
                </label>
                <select
                  value={formData.academicYearId}
                  onChange={(e) => setFormData({...formData, academicYearId: e.target.value})}
                  className={`form-group__input ${errors.academicYearId ? 'form-group__input--error' : ''}`}
                >
                  <option value="">Select academic year</option>
                  {academicYears.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.academicYearId}
                  </span>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Grade Level *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                    className={`form-group__input ${errors.gradeLevel ? 'form-group__input--error' : ''}`}
                  >
                    <option value="">Select grade</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                  {errors.gradeLevel && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.gradeLevel}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Section *
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className={`form-group__input ${errors.section ? 'form-group__input--error' : ''}`}
                    placeholder="e.g., A, B, C"
                    maxLength="2"
                  />
                  {errors.section && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.section}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`form-group__input ${errors.name ? 'form-group__input--error' : ''}`}
                  placeholder="e.g., Grade 2-A"
                />
                {errors.name && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.name}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className={`form-group__input ${errors.capacity ? 'form-group__input--error' : ''}`}
                  placeholder="Maximum number of students"
                  min="1"
                  max="100"
                />
                {errors.capacity && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.capacity}
                  </span>
                )}
              </div>
              
              <div className="modal__actions">
                <button 
                  type="button" 
                  className="btn btn--secondary"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      {editingClass ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingClass ? 'Update Class' : 'Create Class'}
                    </>
                  )}
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
