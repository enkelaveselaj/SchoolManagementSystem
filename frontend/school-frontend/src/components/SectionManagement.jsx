import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, Users, Calendar, BookOpen } from 'lucide-react';
import schoolService from '../services/schoolService';

const SectionManagement = () => {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    classId: '',
    name: '',
    capacity: 30,
    roomNumber: ''
  });
  const [filterClass, setFilterClass] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sectionsData, classesData] = await Promise.all([
        schoolService.getAllSections(),
        schoolService.getAllClasses()
      ]);
      setSections(sectionsData);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Section name is required';
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
      
      if (editingSection) {
        await schoolService.updateSection(editingSection.id, {
          ...formData,
          classId: parseInt(formData.classId),
          capacity: parseInt(formData.capacity)
        });
      } else {
        await schoolService.createSection({
          ...formData,
          classId: parseInt(formData.classId),
          capacity: parseInt(formData.capacity)
        });
      }
      
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      classId: section.classId.toString(),
      name: section.name,
      capacity: section.capacity,
      roomNumber: section.roomNumber || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (section) => {
    if (window.confirm(`Are you sure you want to delete ${section.name}?`)) {
      try {
        await schoolService.deleteSection(section.id);
        await loadData();
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Failed to delete section. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      classId: '',
      name: '',
      capacity: 30,
      roomNumber: ''
    });
    setErrors({});
    setEditingSection(null);
  };

  const filteredSections = sections.filter(section => {
    const matchesClass = !filterClass || section.classId.toString() === filterClass;
    return matchesClass;
  });

  const getClassName = (classId) => {
    const classItem = classes.find(cls => cls.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="section-management">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title">
            <Building className="page-header__icon" size={28} />
            <h1>Section Management</h1>
          </div>
          <p className="page-header__description">
            Organize student sections within classes for better classroom management
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
          Add Section
        </button>
      </div>

      {/* Filters */}
      <div className="page-controls">
        <div className="search-filter-group">
          <div className="filter-dropdown">
            <Filter className="filter-dropdown__icon" size={20} />
            <select 
              value={filterClass} 
              onChange={(e) => setFilterClass(e.target.value)}
              className="filter-dropdown__select"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="stats-summary">
          <span className="stats-summary__count">
            {filteredSections.length} {filteredSections.length === 1 ? 'Section' : 'Sections'}
          </span>
          <span className="stats-summary__total">
            Total: {sections.length} sections
          </span>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="sections-grid">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <div key={section.id} className="section-card">
              <div className="section-card__header">
                <div className="section-card__title-section">
                  <h3 className="section-card__title">{section.name}</h3>
                  <div className="section-card__class-badge">
                    <BookOpen size={14} />
                    {getClassName(section.classId)}
                  </div>
                </div>
                <div className="section-card__actions">
                  <button 
                    className="btn-icon btn-icon--edit"
                    onClick={() => handleEdit(section)}
                    title="Edit section"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-icon--delete"
                    onClick={() => handleDelete(section)}
                    title="Delete section"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="section-card__content">
                <div className="section-card__info">
                  <div className="info-item">
                    <span className="info-item__label">Class</span>
                    <span className="info-item__value">
                      {getClassName(section.classId)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-item__label">Capacity</span>
                    <span className="info-item__value">{section.capacity} students</span>
                  </div>
                  {section.roomNumber && (
                    <div className="info-item">
                      <span className="info-item__label">Room</span>
                      <span className="info-item__value">{section.roomNumber}</span>
                    </div>
                  )}
                </div>
                
                <div className="section-card__stats">
                  <div className="stat-item">
                    <Users className="stat-item__icon" size={16} />
                    <div className="stat-item__content">
                      <span className="stat-item__value">--</span>
                      <span className="stat-item__label">Enrolled</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Calendar className="stat-item__icon" size={16} />
                    <div className="stat-item__content">
                      <span className="stat-item__value">--</span>
                      <span className="stat-item__label">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Building className="empty-state__icon" size={48} />
            <h3 className="empty-state__title">No Sections Found</h3>
            <p className="empty-state__description">
              {filterClass 
                ? 'No sections found for this class.'
                : 'Get started by creating your first section.'}
            </p>
            {!filterClass && (
              <button 
                className="btn btn--primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={20} />
                Create First Section
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
                {editingSection ? 'Edit Section' : 'Add New Section'}
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
                  Class *
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  className={`form-group__input ${errors.classId ? 'form-group__input--error' : ''}`}
                >
                  <option value="">Select class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.classId}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`form-group__input ${errors.name ? 'form-group__input--error' : ''}`}
                  placeholder="e.g., Section A, Morning Group"
                />
                {errors.name && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.name}
                  </span>
                )}
              </div>
              
              <div className="form-row">
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
                
                <div className="form-group">
                  <label className="form-group__label">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="form-group__input"
                    placeholder="e.g., Room 101"
                  />
                </div>
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
                      {editingSection ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingSection ? 'Update Section' : 'Create Section'}
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

export default SectionManagement;
