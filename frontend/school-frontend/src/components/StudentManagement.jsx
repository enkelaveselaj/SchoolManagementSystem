import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, GraduationCap, Calendar, BookOpen, Mail, Phone } from 'lucide-react';
import { studentAPI } from '../services/teacherStudentService';
import schoolService from '../services/schoolService';
import { adminAPI } from '../services/adminService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentStudent, setAssignmentStudent] = useState(null);
  const [assignmentData, setAssignmentData] = useState({ classId: '', sectionId: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    password: ''
  });
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [studentParents, setStudentParents] = useState({});

  const classOptions = classes.length
    ? classes
    : [
        { id: '10', name: 'Class 10' },
        { id: '11', name: 'Class 11' },
        { id: '12', name: 'Class 12' }
      ];

  const sectionOptions = sections.length
    ? sections
    : [
        { id: '10A', classId: '10', name: 'Section A' },
        { id: '10B', classId: '10', name: 'Section B' },
        { id: '11A', classId: '11', name: 'Section A' },
        { id: '11B', classId: '11', name: 'Section B' },
        { id: '12A', classId: '12', name: 'Section A' },
        { id: '12B', classId: '12', name: 'Section B' }
      ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [studentsData, classesData, sectionsData, parentsData] = await Promise.all([
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
        }),
        adminAPI.getParents().catch(err => {
          console.error('Error fetching parents:', err);
          return [];
        })
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setSections(sectionsData);

      const parentMap = {};
      (parentsData || []).forEach((parent) => {
        const parentName = `${parent.first_name || parent.firstName || ''} ${parent.last_name || parent.lastName || ''}`.trim();
        (parent.students || []).forEach((student) => {
          const studentId = Number(student.id);
          if (!parentMap[studentId]) {
            parentMap[studentId] = [];
          }
          if (!parentMap[studentId].includes(parentName) && parentName) {
            parentMap[studentId].push(parentName);
          }
        });
      });
      setStudentParents(parentMap);
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
    
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        await studentAPI.updateStudent(editingStudent.id, formData);
      } else {
        await studentAPI.createStudent(formData);
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
      username: student.username || '',
      email: student.email,
      gender: student.gender || '',
      dateOfBirth: student.dateOfBirth,
      password: ''
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
      username: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      password: ''
    });
    setErrors({});
    setEditingStudent(null);
  };

  const openAssignmentModal = (student) => {
    setAssignmentStudent(student);
    setAssignmentData({
      classId: student.classId?.toString() || '',
      sectionId: student.sectionId?.toString() || ''
    });
    setShowAssignmentModal(true);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentStudent) return;

    try {
      setSubmitting(true);
      await studentAPI.updateStudent(assignmentStudent.id, {
        ...assignmentStudent,
        classId: assignmentData.classId ? parseInt(assignmentData.classId, 10) : null,
        sectionId: assignmentData.sectionId ? parseInt(assignmentData.sectionId, 10) : null
      });
      await loadData();
      setShowAssignmentModal(false);
      setAssignmentStudent(null);
    } catch (error) {
      console.error('Error assigning student:', error);
      alert('Failed to update assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
    const classItem = classOptions.find(cls => cls.id?.toString() === classId?.toString());
    return classItem ? classItem.name : 'Unknown Class';
  };

  const getSectionName = (sectionId) => {
    if (!sectionId) return 'No Section';
    const sectionItem = sectionOptions.find(sec => sec.id?.toString() === sectionId?.toString());
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
            {classOptions.map(cls => (
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
            {sectionOptions.filter(section => !filterClass || section.classId?.toString() === filterClass).map(section => (
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
                  <button
                    onClick={() => openAssignmentModal(student)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(15, 118, 110, 0.1)',
                      color: '#0f766e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Assign class & section"
                  >
                    <Calendar size={16} />
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
                    <span style={{ color: '#718096', fontWeight: '500' }}>Parents</span>
                    <span style={{ color: '#1a202c', fontWeight: '600', textAlign: 'right' }}>
                      {studentParents[Number(student.id)]?.length
                        ? studentParents[Number(student.id)].join(', ')
                        : 'Not specified'}
                    </span>
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
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className={`form-group__input ${errors.username ? 'form-group__input--error' : ''}`}
                  placeholder="e.g. jsmith25"
                />
                {errors.username && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.username}
                  </span>
                )}
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
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className={`form-group__input ${errors.gender ? 'form-group__input--error' : ''}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {errors.gender}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-group__label">
                    Birthday *
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
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`form-group__input ${errors.password ? 'form-group__input--error' : ''}`}
                  placeholder="Temporary password"
                />
                {errors.password && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {errors.password}
                  </span>
                )}
              </div>
              
              <p className="form-hint">
                Additional details (class, contacts, guardians) can be added after the initial account is created.
              </p>
              
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

      {showAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowAssignmentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Assign Class & Section</h3>
              <button className="modal__close" onClick={() => setShowAssignmentModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAssignmentSubmit} className="modal__body">
              <div className="form-group">
                <label className="form-group__label">Class</label>
                <select
                  value={assignmentData.classId}
                  onChange={(e) => {
                    const newClassId = e.target.value;
                    setAssignmentData({
                      classId: newClassId,
                      sectionId: ''
                    });
                  }}
                  className="form-group__input"
                >
                  <option value="">Select class</option>
                  {classOptions.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-group__label">Section</label>
                <select
                  value={assignmentData.sectionId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, sectionId: e.target.value })}
                  className="form-group__input"
                  disabled={!assignmentData.classId}
                >
                  <option value="">Select section</option>
                  {sectionOptions
                    .filter((sec) => !assignmentData.classId || sec.classId?.toString() === assignmentData.classId)
                    .map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn--secondary" onClick={() => setShowAssignmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Assignment'}
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
