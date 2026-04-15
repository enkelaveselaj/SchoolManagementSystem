import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react';
import schoolService from '../services/schoolService';
import './AcademicYear.css';

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

    if (!formData.name) {
      newErrors.name = 'Academic year name is required';
    }

    if (!formData.startYear) {
      newErrors.startYear = 'Start year is required';
    }

    if (!formData.endYear) {
      newErrors.endYear = 'End year is required';
    }

    if (formData.startYear && formData.endYear && parseInt(formData.endYear) <= parseInt(formData.startYear)) {
      newErrors.endYear = 'End year must be greater than start year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      startYear: year.startYear,
      endYear: year.endYear,
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
        console.error(error);
      }
    }
  };

  const setCurrentYear = async (year) => {
    try {
      await schoolService.updateAcademicYear(year.id, {
        ...year,
        isCurrent: true
      });

      await loadAcademicYears();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startYear: '',
      endYear: '',
      isCurrent: false
    });

    setEditingYear(null);
    setErrors({});
  };

  const filteredYears = academicYears.filter(year => {
    const matchSearch =
      year.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'current') return matchSearch && year.isCurrent;
    if (filter === 'past') return matchSearch && !year.isCurrent;

    return matchSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Loading academic years...</p>
      </div>
    );
  }

  return (
    <div className="academic-year-management">

      <div className="academic-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Calendar size={32} />
            </div>
            <div className="header-text">
              <h1>Academic Years</h1>
              <p>Manage and organize school academic years and terms</p>
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
              Add Academic Year
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
              placeholder="Search academic years..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <Filter size={16} />
            All Years
          </button>
          <button
            className={`filter-btn ${filter === 'current' ? 'active' : ''}`}
            onClick={() => setFilter('current')}
          >
            <Clock size={16} />
            Current
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            <BookOpen size={16} />
            Past
          </button>
        </div>
      </div>

      <div className="content-section">
        {filteredYears.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">
                <Calendar size={40} />
              </div>
              <div className="empty-text">
                <h3>No Academic Years Found</h3>
                <p>
                  {searchTerm || filter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by adding your first academic year'}
                </p>
                {!searchTerm && filter === 'all' && (
                  <button
                    className="btn-enhanced"
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                  >
                    <Plus size={18} />
                    Add First Academic Year
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="academic-grid">
            {filteredYears.map((year) => (
              <div key={year.id} className="academic-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{year.name}</h3>
                    {year.isCurrent && (
                      <span className="category-badge">
                        <Award size={12} />
                        Current Year
                      </span>
                    )}
                  </div>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => handleEdit(year)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(year)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="year-info">
                    <div className="year-range">
                      <Calendar size={16} />
                      <span>{year.startYear} - {year.endYear}</span>
                    </div>
                    <div className={`status ${year.isCurrent ? 'active' : ''}`}>
                      <div className="dot" />
                      {year.isCurrent ? 'Active' : 'Archived'}
                    </div>
                  </div>
                  {!year.isCurrent && (
                    <button
                      className="btn-set btn-enhanced"
                      onClick={() => setCurrentYear(year)}
                    >
                      <Check size={14} />
                      Set as Current
                    </button>
                  )}
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
              <h2 className="modal-title">
                {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
              </h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Academic Year Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2023-2024 Academic Year"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? 'form-input-error' : ''}
                  />
                  {errors.name && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Start Year <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2023"
                    value={formData.startYear}
                    onChange={(e) =>
                      setFormData({ ...formData, startYear: e.target.value })
                    }
                    className={errors.startYear ? 'form-input-error' : ''}
                  />
                  {errors.startYear && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.startYear}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    End Year <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2024"
                    value={formData.endYear}
                    onChange={(e) =>
                      setFormData({ ...formData, endYear: e.target.value })
                    }
                    className={errors.endYear ? 'form-input-error' : ''}
                  />
                  {errors.endYear && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.endYear}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="isCurrent"
                      checked={formData.isCurrent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isCurrent: e.target.checked
                        })
                      }
                    />
                    <label htmlFor="isCurrent">
                      Mark as Current Academic Year
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit btn-large" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="loading-spinner" />
                      {editingYear ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingYear ? 'Update Year' : 'Create Year'}
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
