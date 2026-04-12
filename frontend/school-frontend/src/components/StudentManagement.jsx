import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, GraduationCap, Calendar, BookOpen, Mail, Phone } from 'lucide-react';
import { studentAPI } from '../services/teacherStudentService';
import schoolService from '../services/schoolService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    classId: '',
    sectionId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [studentsData, classesData, sectionsData] = await Promise.all([
        studentAPI.getAllStudents().catch(err => {
          console.error('Error fetching students:', err);
          return [];
        }),
        schoolService.getAllClasses().catch(err => {
          console.error('Error fetching classes:', err);
          return [];
        }),
        schoolService.getAllSections().catch(err => {
          console.error('Error fetching sections:', err);
          return [];
        })
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setSections(sectionsData);
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
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }
    
    if (!formData.sectionId) {
      newErrors.sectionId = 'Section is required';
    }
    
    if (!formData.parentName || formData.parentName.trim() === '') {
      newErrors.parentName = 'Parent name is required';
    }
    
    if (!formData.parentPhone || formData.parentPhone.trim() === '') {
      newErrors.parentPhone = 'Parent phone is required';
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
      
      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent.id, {
          ...formData,
          classId: parseInt(formData.classId),
          sectionId: parseInt(formData.sectionId)
        });
      } else {
        await studentAPI.createStudent({
          ...formData,
          classId: parseInt(formData.classId),
          sectionId: parseInt(formData.sectionId)
        });
      }
      
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth,
      address: student.address || '',
      classId: student.classId?.toString() || '',
      sectionId: student.sectionId?.toString() || '',
      enrollmentDate: student.enrollmentDate,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentAPI.deleteStudent(student.id);
        await loadData();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
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
      classId: '',
      sectionId: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      parentName: '',
      parentPhone: '',
      parentEmail: ''
    });
    setErrors({});
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesClass = !filterClass || student.classId?.toString() === filterClass;
    const matchesSection = !filterSection || student.sectionId?.toString() === filterSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  const getClassName = (classId) => {
    if (!classId) return 'No Class';
    const classItem = classes.find(cls => cls.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  const getSectionName = (sectionId) => {
    if (!sectionId) return 'No Section';
    const sectionItem = sections.find(sec => sec.id === sectionId);
    return sectionItem ? sectionItem.name : 'Unknown Section';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="student-management">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title">
            <GraduationCap className="page-header__icon" size={28} />
            <h1>Student Management</h1>
          </div>
          <p className="page-header__description">
            Manage student enrollment, records, and academic information
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
          Add Student
        </button>
      </div>

      {/* Filters and Search */}
      <div className="page-controls">
        <div className="search-filter-group">
          <div className="search-box">
            <Search size={20} className="search-box__icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box__input"
            />
          </div>
          
          <div className="filter-dropdown">
            <BookOpen className="filter-dropdown__icon" size={20} />
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
          
          <div className="filter-dropdown">
            <Users className="filter-dropdown__icon" size={20} />
            <select 
              value={filterSection} 
              onChange={(e) => setFilterSection(e.target.value)}
              className="filter-dropdown__select"
            >
              <option value="">All Sections</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="stats-summary">
          <span className="stats-summary__count">
            {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
          </span>
          <span className="stats-summary__total">
            Total: {students.length} students
          </span>
        </div>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-card__header">
                <div className="student-card__title-section">
                  <h3 className="student-card__title">
                    {student.firstName} {student.lastName}
                  </h3>
                  <div className="student-card__metadata">
                    <span className="student-card__class">
                      {getClassName(student.classId)}
                    </span>
                    <span className="student-card__section">
                      {getSectionName(student.sectionId)}
                    </span>
                  </div>
                </div>
                <div className="student-card__actions">
                  <button 
                    className="btn-icon btn-icon--edit"
                    onClick={() => handleEdit(student)}
                    title="Edit student"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-icon--delete"
                    onClick={() => handleDelete(student)}
                    title="Delete student"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="student-card__content">
                <div className="student-card__contact">
                  <div className="contact-item">
                    <Mail className="contact-item__icon" size={14} />
                    <span className="contact-item__value">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="contact-item">
                      <Phone className="contact-item__icon" size={14} />
                      <span className="contact-item__value">{student.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="student-card__info">
                  <div className="info-item">
                    <span className="info-item__label">Date of Birth</span>
                    <span className="info-item__value">{student.dateOfBirth}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-item__label">Enrollment Date</span>
                    <span className="info-item__value">{student.enrollmentDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-item__label">Parent</span>
                    <span className="info-item__value">{student.parentName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <GraduationCap className="empty-state__icon" size={48} />
            <h3 className="empty-state__title">No Students Found</h3>
            <p className="empty-state__description">
              {searchTerm || filterClass || filterSection
                ? 'No students match your search criteria.'
                : 'Get started by adding your first student.'}
            </p>
            {!searchTerm && !filterClass && !filterSection && (
              <button 
                className="btn btn--primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={20} />
                Add First Student
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
                {editingStudent ? 'Edit Student' : 'Add New Student'}
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
                  placeholder="student@example.com"
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
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className={`form-group__input ${errors.dateOfBirth ? 'form-group__input--error' : ''}`}
                  />
                  {errors.dateOfBirth && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.dateOfBirth}
                    </span>
                  )}
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
                  placeholder="Enter student address"
                  rows={3}
                />
              </div>
              
              <div className="form-row">
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
                    Section *
                  </label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
                    className={`form-group__input ${errors.sectionId ? 'form-group__input--error' : ''}`}
                  >
                    <option value="">Select section</option>
                    {sections.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                  {errors.sectionId && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.sectionId}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({...formData, enrollmentDate: e.target.value})}
                  className="form-group__input"
                />
              </div>
              
              <div className="form-section-divider">
                <h4>Parent/Guardian Information</h4>
              </div>
              
              <div className="form-group">
                <label className="form-group__label">
                  Parent Name *
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className={`form-group__input ${errors.parentName ? 'form-group__input--error' : ''}`}
                  placeholder="Parent/Guardian full name"
                />
                {errors.parentName && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.parentName}
                  </span>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Parent Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                    className={`form-group__input ${errors.parentPhone ? 'form-group__input--error' : ''}`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.parentPhone && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.parentPhone}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                    className="form-group__input"
                    placeholder="parent@example.com"
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
                      {editingStudent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingStudent ? 'Update Student' : 'Create Student'}
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

export default StudentManagement;
