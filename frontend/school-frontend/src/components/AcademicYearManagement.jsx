import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import schoolService from '../services/schoolService';

const AcademicYearManagement = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startYear: '',
    endYear: '',
    isCurrent: false
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const loadAcademicYears = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getAllAcademicYears();
      setAcademicYears(data);
    } catch (error) {
      console.error('Error loading academic years:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Academic year name is required';
    }
    
    if (!formData.startYear) {
      newErrors.startYear = 'Start year is required';
    } else if (isNaN(formData.startYear) || formData.startYear < 2000 || formData.startYear > 2100) {
      newErrors.startYear = 'Start year must be between 2000 and 2100';
    }
    
    if (!formData.endYear) {
      newErrors.endYear = 'End year is required';
    } else if (isNaN(formData.endYear) || formData.endYear < 2000 || formData.endYear > 2100) {
      newErrors.endYear = 'End year must be between 2000 and 2100';
    }
    
    if (formData.startYear && formData.endYear && parseInt(formData.endYear) <= parseInt(formData.startYear)) {
      newErrors.endYear = 'End year must be greater than start year';
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
      
      if (editingYear) {
        await schoolService.updateAcademicYear(editingYear.id, {
          ...formData,
          startYear: parseInt(formData.startYear),
          endYear: parseInt(formData.endYear)
        });
      } else {
        await schoolService.createAcademicYear({
          ...formData,
          startYear: parseInt(formData.startYear),
          endYear: parseInt(formData.endYear)
        });
      }
      
      await loadAcademicYears();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving academic year:', error);
      alert('Failed to save academic year. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      startYear: year.startYear.toString(),
      endYear: year.endYear.toString(),
      isCurrent: year.isCurrent
    });
    setShowForm(true);
  };

  const handleDelete = async (year) => {
    if (window.confirm(`Are you sure you want to delete ${year.name}?`)) {
      try {
        await schoolService.deleteAcademicYear(year.id);
        await loadAcademicYears();
      } catch (error) {
        console.error('Error deleting academic year:', error);
        alert('Failed to delete academic year. Please try again.');
      }
    }
  };

  const setCurrentYear = async (year) => {
    try {
      await schoolService.updateAcademicYear(year.id, { ...year, isCurrent: true });
      await loadAcademicYears();
    } catch (error) {
      console.error('Error setting current year:', error);
      alert('Failed to set current academic year. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startYear: '',
      endYear: '',
      isCurrent: false
    });
    setErrors({});
    setEditingYear(null);
  };

  const filteredYears = academicYears.filter(year => {
    const matchesSearch = year.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         year.startYear.toString().includes(searchTerm) ||
                         year.endYear.toString().includes(searchTerm);
    
    if (filter === 'current') {
      return matchesSearch && year.isCurrent;
    } else if (filter === 'past') {
      return matchesSearch && !year.isCurrent;
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading academic years...</p>
      </div>
    );
  }

  return (
    <div className="academic-years-management">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title">
            <Calendar className="page-header__icon" size={28} />
            <h1>Academic Year Management</h1>
          </div>
          <p className="page-header__description">
            Manage academic years, terms, and school calendar periods
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
          Add Academic Year
        </button>
      </div>

      {/* Filters and Search */}
      <div className="page-controls">
        <div className="search-filter-group">
          <div className="search-box">
            <Search size={20} className="search-box__icon" />
            <input
              type="text"
              placeholder="Search academic years..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box__input"
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter size={20} className="filter-dropdown__icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-dropdown__select"
            >
              <option value="all">All Years</option>
              <option value="current">Current Year</option>
              <option value="past">Past Years</option>
            </select>
          </div>
        </div>
        
        <div className="stats-summary">
          <span className="stats-summary__count">
            {filteredYears.length} {filteredYears.length === 1 ? 'Year' : 'Years'}
          </span>
          {academicYears.some(year => year.isCurrent) && (
            <span className="stats-summary__current">
              <Check size={16} />
              Current Year Active
            </span>
          )}
        </div>
      </div>

      {/* Academic Years List */}
      <div className="academic-years-grid">
        {filteredYears.length > 0 ? (
          filteredYears.map((year) => (
            <div key={year.id} className="year-card">
              <div className="year-card__header">
                <div className="year-card__title-section">
                  <h3 className="year-card__title">{year.name}</h3>
                  {year.isCurrent && (
                    <span className="year-card__current-badge">
                      <Clock size={14} />
                      Current
                    </span>
                  )}
                </div>
                <div className="year-card__actions">
                  <button 
                    className="btn-icon btn-icon--edit"
                    onClick={() => handleEdit(year)}
                    title="Edit academic year"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-icon--delete"
                    onClick={() => handleDelete(year)}
                    title="Delete academic year"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="year-card__content">
                <div className="year-card__period">
                  <div className="period-item">
                    <span className="period-item__label">Start Year</span>
                    <span className="period-item__value">{year.startYear}</span>
                  </div>
                  <div className="period-item">
                    <span className="period-item__label">End Year</span>
                    <span className="period-item__value">{year.endYear}</span>
                  </div>
                </div>
                
                <div className="year-card__status">
                  <div className="status-indicator">
                    <span className={`status-dot ${year.isCurrent ? 'status-dot--active' : 'status-dot--inactive'}`}></span>
                    <span className="status-text">
                      {year.isCurrent ? 'Active Academic Year' : 'Archived'}
                    </span>
                  </div>
                </div>
                
                {!year.isCurrent && (
                  <button 
                    className="btn btn--secondary btn--small"
                    onClick={() => setCurrentYear(year)}
                  >
                    Set as Current
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Calendar className="empty-state__icon" size={48} />
            <h3 className="empty-state__title">No Academic Years Found</h3>
            <p className="empty-state__description">
              {searchTerm || filter !== 'all' 
                ? 'No academic years match your search criteria.'
                : 'Get started by creating your first academic year.'}
            </p>
            {!searchTerm && filter === 'all' && (
              <button 
                className="btn btn--primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={20} />
                Create First Academic Year
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
                {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
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
                  Academic Year Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`form-group__input ${errors.name ? 'form-group__input--error' : ''}`}
                  placeholder="e.g., 2025-2026"
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
                    Start Year *
                  </label>
                  <input
                    type="number"
                    value={formData.startYear}
                    onChange={(e) => setFormData({...formData, startYear: e.target.value})}
                    className={`form-group__input ${errors.startYear ? 'form-group__input--error' : ''}`}
                    placeholder="e.g., 2025"
                    min="2000"
                    max="2100"
                  />
                  {errors.startYear && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.startYear}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    End Year *
                  </label>
                  <input
                    type="number"
                    value={formData.endYear}
                    onChange={(e) => setFormData({...formData, endYear: e.target.value})}
                    className={`form-group__input ${errors.endYear ? 'form-group__input--error' : ''}`}
                    placeholder="e.g., 2026"
                    min="2000"
                    max="2100"
                  />
                  {errors.endYear && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.endYear}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
                    className="checkbox-group__input"
                  />
                  <span className="checkbox-group__label">
                    Set as current academic year
                  </span>
                </label>
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
                      {editingYear ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingYear ? 'Update Academic Year' : 'Create Academic Year'}
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

export default AcademicYearManagement;
