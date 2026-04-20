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
    <div style={{
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#1a202c',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <GraduationCap size={28} />
          </div>
          Teacher Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Manage teacher records, assignments, and professional information.
        </p>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flex: 1,
          flexWrap: 'wrap'
        }}>
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: '250px'
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#718096'
            }} />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                fontWeight: '500',
                color: '#1a202c'
              }}
            />
          </div>
          
          <select 
            value={filterSpecialization} 
            onChange={(e) => setFilterSpecialization(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              fontWeight: '500',
              color: '#1a202c',
              minWidth: '150px'
            }}
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0'
              }}>
                {teachers.length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                fontWeight: '500'
              }}>
                Total Teachers
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0'
              }}>
                {specializations.length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                fontWeight: '500'
              }}>
                Specializations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: '0 0 8px 0'
                  }}>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {teacher.specialization}
                    </span>
                    <span style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ID: {teacher.employeeId}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button 
                    onClick={() => handleEdit(teacher)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Edit teacher"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(teacher)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Delete teacher"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#4a5568'
                  }}>
                    <Mail size={14} />
                    <span>{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#4a5568'
                    }}>
                      <Phone size={14} />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '13px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#718096', fontWeight: '500' }}>Qualification</span>
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>{teacher.qualification || 'Not specified'}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#718096', fontWeight: '500' }}>Experience</span>
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>
                      {teacher.experience ? `${teacher.experience} years` : 'Not specified'}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#718096', fontWeight: '500' }}>Hire Date</span>
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>{teacher.hireDate}</span>
                  </div>
                  {teacher.salary && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: '#718096', fontWeight: '500' }}>Salary</span>
                      <span style={{ color: '#1a202c', fontWeight: '600' }}>${teacher.salary.toLocaleString()}/year</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto 24px'
            }}>
              <GraduationCap size={32} />
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 12px'
            }}>No Teachers Found</h3>
            <p style={{
              fontSize: '16px',
              color: '#718096',
              margin: '0 0 24px',
              lineHeight: '1.5'
            }}>
              {searchTerm || filterSpecialization
                ? 'No teachers match your search criteria.'
                : 'Get started by adding your first teacher.'}
            </p>
            {!searchTerm && !filterSpecialization && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                <Plus size={18} />
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
