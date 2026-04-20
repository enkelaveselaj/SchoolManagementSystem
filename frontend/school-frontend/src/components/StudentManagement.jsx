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
          Student Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Manage student records, enrollments, and academic information.
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
              placeholder="Search students..."
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
            value={filterClass} 
            onChange={(e) => setFilterClass(e.target.value)}
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
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          
          <select 
            value={filterSection} 
            onChange={(e) => setFilterSection(e.target.value)}
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
            <option value="">All Sections</option>
            {sections.filter(section => !filterClass || section.classId === filterClass).map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
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
            Add Student
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
                {students.length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                fontWeight: '500'
              }}>
                Total Students
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
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0'
              }}>
                {classes.length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                fontWeight: '500'
              }}>
                Classes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} style={{
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
                    {student.firstName} {student.lastName}
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
                      {getClassName(student.classId)}
                    </span>
                    <span style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getSectionName(student.sectionId)}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button 
                    onClick={() => handleEdit(student)}
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
                    title="Edit student"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(student)}
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
                    title="Delete student"
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
                    <span>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#4a5568'
                    }}>
                      <Phone size={14} />
                      <span>{student.phone}</span>
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
                    <span style={{ color: '#718096', fontWeight: '500' }}>Date of Birth</span>
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>{student.dateOfBirth || 'Not specified'}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#718096', fontWeight: '500' }}>Enrollment Date</span>
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>{student.enrollmentDate}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#718096', fontWeight: '500' }}>Parent</span>
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>{student.parentName || 'Not specified'}</span>
                  </div>
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
            }}>No Students Found</h3>
            <p style={{
              fontSize: '16px',
              color: '#718096',
              margin: '0 0 24px',
              lineHeight: '1.5'
            }}>
              {searchTerm || filterClass || filterSection
                ? 'No students match your search criteria.'
                : 'Get started by adding your first student.'}
            </p>
            {!searchTerm && !filterClass && !filterSection && (
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
