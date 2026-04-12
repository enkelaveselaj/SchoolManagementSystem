import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, GraduationCap, Calendar, BookOpen, Mail, Phone, Award } from 'lucide-react';
import { teacherAPI } from '../services/teacherStudentService';
import schoolService from '../services/schoolService';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    specialization: '',
    qualification: '',
    experience: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    employeeId: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teachersData, classesData] = await Promise.all([
        teacherAPI.getAllTeachers(),
        schoolService.getAllClasses()
      ]);
      setTeachers(teachersData);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.specialization || formData.specialization.trim() === '') {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.qualification || formData.qualification.trim() === '') {
      newErrors.qualification = 'Qualification is required';
    }
    
    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
    }
    
    if (!formData.employeeId || formData.employeeId.trim() === '') {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    if (!formData.emergencyContact || formData.emergencyContact.trim() === '') {
      newErrors.emergencyContact = 'Emergency contact is required';
    }
    
    if (!formData.emergencyPhone || formData.emergencyPhone.trim() === '') {
      newErrors.emergencyPhone = 'Emergency phone is required';
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
      
      const teacherData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        experience: formData.experience ? parseInt(formData.experience) : null
      };
      
      if (editingTeacher) {
        await teacherAPI.updateTeacher(editingTeacher.id, teacherData);
      } else {
        await teacherAPI.createTeacher(teacherData);
      }
      
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone || '',
      dateOfBirth: teacher.dateOfBirth || '',
      address: teacher.address || '',
      specialization: teacher.specialization,
      qualification: teacher.qualification,
      experience: teacher.experience?.toString() || '',
      hireDate: teacher.hireDate,
      salary: teacher.salary?.toString() || '',
      employeeId: teacher.employeeId,
      emergencyContact: teacher.emergencyContact,
      emergencyPhone: teacher.emergencyPhone
    });
    setShowForm(true);
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
      try {
        await teacherAPI.deleteTeacher(teacher.id);
        await loadData();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Failed to delete teacher. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      specialization: '',
      qualification: '',
      experience: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: '',
      employeeId: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
    setErrors({});
    setEditingTeacher(null);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = (teacher?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (teacher?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (teacher?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (teacher?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesSpecialization = !filterSpecialization || teacher.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [...new Set(teachers.map(teacher => teacher.specialization))];

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="teacher-management">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title">
            <GraduationCap className="page-header__icon" size={28} />
            <h1>Teacher Management</h1>
          </div>
          <p className="page-header__description">
            Manage teacher records, assignments, and professional information
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
          Add Teacher
        </button>
      </div>

      {/* Filters and Search */}
      <div className="page-controls">
        <div className="search-filter-group">
          <div className="search-box">
            <Search size={20} className="search-box__icon" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box__input"
            />
          </div>
          
          <div className="filter-dropdown">
            <Award className="filter-dropdown__icon" size={20} />
            <select 
              value={filterSpecialization} 
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="filter-dropdown__select"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="stats-summary">
          <span className="stats-summary__count">
            {filteredTeachers.length} {filteredTeachers.length === 1 ? 'Teacher' : 'Teachers'}
          </span>
          <span className="stats-summary__total">
            Total: {teachers.length} teachers
          </span>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="teachers-grid">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-card__header">
                <div className="teacher-card__title-section">
                  <h3 className="teacher-card__title">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <div className="teacher-card__metadata">
                    <span className="teacher-card__specialization">
                      {teacher.specialization}
                    </span>
                    <span className="teacher-card__employee-id">
                      ID: {teacher.employeeId}
                    </span>
                  </div>
                </div>
                <div className="teacher-card__actions">
                  <button 
                    className="btn-icon btn-icon--edit"
                    onClick={() => handleEdit(teacher)}
                    title="Edit teacher"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-icon--delete"
                    onClick={() => handleDelete(teacher)}
                    title="Delete teacher"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="teacher-card__content">
                <div className="teacher-card__contact">
                  <div className="contact-item">
                    <Mail className="contact-item__icon" size={14} />
                    <span className="contact-item__value">{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="contact-item">
                      <Phone className="contact-item__icon" size={14} />
                      <span className="contact-item__value">{teacher.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="teacher-card__info">
                  <div className="info-item">
                    <span className="info-item__label">Qualification</span>
                    <span className="info-item__value">{teacher.qualification}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-item__label">Experience</span>
                    <span className="info-item__value">
                      {teacher.experience ? `${teacher.experience} years` : 'Not specified'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-item__label">Hire Date</span>
                    <span className="info-item__value">{teacher.hireDate}</span>
                  </div>
                  {teacher.salary && (
                    <div className="info-item">
                      <span className="info-item__label">Salary</span>
                      <span className="info-item__value">${teacher.salary.toLocaleString()}/year</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <GraduationCap className="empty-state__icon" size={48} />
            <h3 className="empty-state__title">No Teachers Found</h3>
            <p className="empty-state__description">
              {searchTerm || filterSpecialization
                ? 'No teachers match your search criteria.'
                : 'Get started by adding your first teacher.'}
            </p>
            {!searchTerm && !filterSpecialization && (
              <button 
                className="btn btn--primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={20} />
                Add First Teacher
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
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
              <button 
                className="btn-icon btn-icon--close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal__form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={`form-group__input ${errors.firstName ? 'form-group__input--error' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.firstName}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className={`form-group__input ${errors.lastName ? 'form-group__input--error' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`form-group__input ${errors.email ? 'form-group__input--error' : ''}`}
                  placeholder="teacher@example.com"
                />
                {errors.email && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.email}
                  </span>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="form-group__input"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="form-group__input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="form-group__input"
                  placeholder="Enter teacher address"
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className={`form-group__input ${errors.specialization ? 'form-group__input--error' : ''}`}
                    placeholder="e.g., Mathematics, Science, English"
                  />
                  {errors.specialization && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.specialization}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    className={`form-group__input ${errors.qualification ? 'form-group__input--error' : ''}`}
                    placeholder="e.g., Master's in Education"
                  />
                  {errors.qualification && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.qualification}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="form-group__input"
                    placeholder="Years of experience"
                    min="0"
                    max="50"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Hire Date *
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    className={`form-group__input ${errors.hireDate ? 'form-group__input--error' : ''}`}
                  />
                  {errors.hireDate && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.hireDate}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Salary (annual)
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="form-group__input"
                    placeholder="Annual salary"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className={`form-group__input ${errors.employeeId ? 'form-group__input--error' : ''}`}
                    placeholder="e.g., EMP001"
                  />
                  {errors.employeeId && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.employeeId}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-section-divider">
                <h4>Emergency Contact</h4>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    className={`form-group__input ${errors.emergencyContact ? 'form-group__input--error' : ''}`}
                    placeholder="Emergency contact person"
                  />
                  {errors.emergencyContact && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.emergencyContact}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Emergency Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                    className={`form-group__input ${errors.emergencyPhone ? 'form-group__input--error' : ''}`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.emergencyPhone && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.emergencyPhone}
                    </span>
                  )}
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
                      {editingTeacher ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
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

export default TeacherManagement;
