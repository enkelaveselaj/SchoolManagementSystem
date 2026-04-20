import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, Users, Calendar, BookOpen, Award, TrendingUp } from 'lucide-react';
import schoolService from '../services/schoolService';
import './SectionManagement.css';

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
  const [searchTerm, setSearchTerm] = useState('');
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
    const matchSearch = !searchTerm || 
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClassName(section.classId).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchSearch;
  });

  const getClassName = (classId) => {
    const classItem = classes.find(cls => cls.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="section-management">
      {/* Header */}
      <div className="academic-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Building size={32} />
            </div>
            <div className="header-text">
              <h1>Section Management</h1>
              <p>Organize student sections within classes for better classroom management</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn-enhanced"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus size={18} />
              Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              className="search-input"
              placeholder="Search sections..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-section">
          <button
            className={`filter-btn ${!filterClass ? 'active' : ''}`}
            onClick={() => setFilterClass('')}
          >
            <BookOpen size={16} />
            All Classes
          </button>
          {classes.map(cls => (
            <button
              key={cls.id}
              className={`filter-btn ${filterClass === cls.id.toString() ? 'active' : ''}`}
              onClick={() => setFilterClass(cls.id.toString())}
            >
              <Building size={16} />
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="content-section">
        {filteredSections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">
                <Building size={40} />
              </div>
              <div className="empty-text">
                <h3>No Sections Found</h3>
                <p>
                  {filterClass
                    ? 'No sections found for this class.'
                    : 'Get started by creating your first section.'}
                </p>
                {!filterClass && (
                  <button
                    className="btn-enhanced"
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                  >
                    <Plus size={18} />
                    Create First Section
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="academic-grid">
            {filteredSections.map((section) => (
              <div key={section.id} className="academic-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{section.name}</h3>
                    <div className="card-meta">
                      <span className="category-badge">
                        <BookOpen size={12} />
                        {getClassName(section.classId)}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => handleEdit(section)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(section)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="year-info">
                    <div className="year-range">
                      <Building size={16} />
                      <span>{getClassName(section.classId)}</span>
                    </div>
                    <div className="status active">
                      <div className="dot" />
                      {section.capacity} Students
                    </div>
                  </div>
                  {section.roomNumber && (
                    <div className="room-info">
                      <Calendar size={16} />
                      <span>Room {section.roomNumber}</span>
                    </div>
                  )}
                  <div className="class-stats">
                    <div className="stat-item">
                      <Users className="stat-icon" size={16} />
                      <div className="stat-content">
                        <span className="stat-number">--</span>
                        <span className="stat-label">Enrolled</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <TrendingUp className="stat-icon" size={16} />
                      <div className="stat-content">
                        <span className="stat-number">{section.capacity}</span>
                        <span className="stat-label">Capacity</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-enhanced">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Class <span className="required">*</span>
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                    className={`form-select ${errors.classId ? 'form-input-error' : ''}`}
                  >
                    <option value="">Select class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  {errors.classId && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.classId}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>
                    Section Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={errors.name ? 'form-input-error' : ''}
                    placeholder="e.g., Section A, Morning Group"
                  />
                  {errors.name && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.name}
                    </div>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Capacity <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      className={errors.capacity ? 'form-input-error' : ''}
                      placeholder="Maximum number of students"
                      min="1"
                      max="100"
                    />
                    {errors.capacity && (
                      <div className="error-message">
                        <AlertCircle size={14} />
                        {errors.capacity}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      className="form-select"
                      placeholder="e.g., Room 101"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit btn-large"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="loading-spinner" />
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
