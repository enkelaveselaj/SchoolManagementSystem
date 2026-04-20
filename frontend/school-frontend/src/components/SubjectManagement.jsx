import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, BookOpen, Users, Clock, Calendar, Award, Target, UserCheck } from 'lucide-react';
import academicService from '../services/academicService';
import schoolService from '../services/schoolService';
import { teacherAPI } from '../services/teacherStudentService';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    type: 'core',
    gradeLevel: ''
  });
  const [assignmentData, setAssignmentData] = useState({
    teacherId: '',
    classId: '',
    academicYearId: ''
  });
  const [filterType, setFilterType] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsData, teachersData, classesData] = await Promise.all([
        academicService.getAllSubjects().catch(err => {
          console.error('Error fetching subjects:', err);
          return [];
        }),
        teacherAPI.getAllTeachers().catch(err => {
          console.error('Error fetching teachers:', err);
          return [];
        }),
        schoolService.getAllClasses().catch(err => {
          console.error('Error fetching classes:', err);
          return [];
        })
      ]);
      
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setClasses(classesData);
      console.log('Teachers data loaded:', teachersData);
      setErrors({});
    } catch (err) {
      console.error('Error loading subject data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    console.log('Form data before submission:', formData);
    console.log('Subject data to be sent:', {
      ...formData,
      credits: parseInt(formData.credits)
    });

    try {
      const subjectData = {
        ...formData,
        credits: parseInt(formData.credits)
      };

      if (editingSubject) {
        await academicService.updateSubject(editingSubject.id, subjectData);
      } else {
        await academicService.createSubject(subjectData);
      }

      await loadData();
      setShowForm(false);
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 3,
        type: 'core',
        gradeLevel: ''
      });
    } catch (error) {
      console.error('Error saving subject:', error);
      setErrors({ submit: 'Failed to save subject. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      if (assignmentData.teacherId && selectedSubject?.id) {
        await teacherAPI.assignTeacherToSubject(assignmentData.teacherId, selectedSubject.id);
        await loadData();
        setShowAssignmentForm(false);
        setSelectedSubject(null);
        setAssignmentData({
          teacherId: '',
          classId: '',
          academicYearId: ''
        });
      }
    } catch (error) {
      console.error('Error assigning teacher:', error);
      // Check if it's a 404 error (backend endpoint not implemented)
      if (error.response?.status === 404) {
        setErrors({ submit: 'Teacher-subject assignment endpoint not implemented yet. Please contact backend developer.' });
      } else {
        setErrors({ submit: 'Failed to assign teacher. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      credits: subject.credits || 3,
      type: subject.type || 'core',
      gradeLevel: subject.gradeLevel || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await academicService.deleteSubject(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleShowAssignment = (subject) => {
    setSelectedSubject(subject);
    setShowAssignmentForm(true);
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        subject.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || subject.type === filterType;
    const matchesGrade = !filterGrade || subject.gradeLevel === filterGrade;
    return matchesSearch && matchesType && matchesGrade;
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(102, 126, 234, 0.2)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            fontSize: '16px',
            color: '#718096',
            fontWeight: '500'
          }}>
            Loading Subjects...
          </div>
        </div>
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
            <BookOpen size={28} />
          </div>
          Subject Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Manage subjects, assign teachers, and configure academic programs.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
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
              color: '#a0aec0'
            }} />
            <input
              type="text"
              placeholder="Search subjects..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
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
            <option value="">All Types</option>
            <option value="core">Core</option>
            <option value="elective">Elective</option>
            <option value="optional">Optional</option>
          </select>
          
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
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
            <option value="">All Grades</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setShowForm(true)}
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
            New Subject
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
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BookOpen size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Total Subjects
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {subjects.length}
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
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <UserCheck size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Core Subjects
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {subjects.filter(s => s.type === 'core').length}
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
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Award size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Electives
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {subjects.filter(s => s.type === 'elective').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredSubjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: '#718096'
          }}>
            <AlertCircle size={48} style={{ color: '#cbd5e0', marginBottom: '16px' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 8px 0'
            }}>
              No subjects found
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              margin: '0'
            }}>
              {searchTerm || filterType || filterGrade 
                ? 'No matching subjects found' 
                : 'No subjects available'}
            </p>
          </div>
        ) : (
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0'
            }}>
              <thead style={{
                background: 'rgba(102, 126, 234, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <tr>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    Subject
                  </th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    Code
                  </th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    Type
                  </th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    Credits
                  </th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    Grade Level
                  </th>
                                    <th style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a5568',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject, index) => (
                  <tr
                    key={subject.id}
                    style={{
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)',
                      transition: 'all 0.3s ease',
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <td style={{
                      padding: '20px 24px',
                      fontSize: '15px',
                      color: '#1a202c',
                      fontWeight: '600',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}>
                          {subject.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '2px'
                          }}>
                            {subject.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#718096'
                          }}>
                            {subject.description?.substring(0, 50) || ''}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      fontSize: '14px',
                      color: '#4a5568',
                      fontWeight: '500',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea'
                      }}>
                        {subject.code}
                      </span>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      fontSize: '14px',
                      color: '#4a5568',
                      fontWeight: '500',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: subject.type === 'core' ? 'rgba(16, 185, 129, 0.1)' : 
                                   subject.type === 'elective' ? 'rgba(139, 92, 246, 0.1)' : 
                                   'rgba(107, 114, 128, 0.1)',
                        color: subject.type === 'core' ? '#10b981' : 
                               subject.type === 'elective' ? '#8b5cf6' : 
                               '#6b7280'
                      }}>
                        {subject.type}
                      </span>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a202c',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      {subject.credits}
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a202c',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      {subject.gradeLevel || 'All'}
                    </td>
                                        <td style={{
                      padding: '20px 24px',
                      textAlign: 'center',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => handleShowAssignment(subject)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <UserCheck size={16} />
                          Assign
                        </button>
                        <button
                          onClick={() => handleEdit(subject)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subject Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1a202c',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {editingSubject ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSubject(null);
                  setFormData({
                    name: '',
                    code: '',
                    description: '',
                    credits: 3,
                    type: 'core',
                    gradeLevel: '',
                    maxStudents: 30
                  });
                  setErrors({});
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#718096',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.name ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                    placeholder="Enter subject name"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.code ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                    placeholder="e.g., MATH101"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.type ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  >
                    <option value="core">Core</option>
                    <option value="elective">Elective</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Credits
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: e.target.value})}
                    min="1"
                    max="10"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.credits ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Grade Level
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.gradeLevel ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  >
                    <option value="">All Grades</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>

                              </div>

              <div style={{
                marginBottom: '32px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: errors.description ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    minHeight: '100px',
                    resize: 'vertical',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500',
                    color: '#1a202c'
                  }}
                  placeholder="Enter subject description..."
                ></textarea>
              </div>

              {errors.submit && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <p style={{
                    color: '#ef4444',
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {errors.submit}
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSubject(null);
                    setFormData({
                      name: '',
                      code: '',
                      description: '',
                      credits: 3,
                      type: 'core',
                      gradeLevel: '',
                      maxStudents: 30
                    });
                    setErrors({});
                  }}
                  style={{
                    padding: '14px 24px',
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: '#4b5563',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Saving...' : (editingSubject ? 'Update Subject' : 'Create Subject')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Assignment Modal */}
      {showAssignmentForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1a202c',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <UserCheck size={20} />
                </div>
                Assign Teacher - {selectedSubject?.name}
              </h2>
              <button
                onClick={() => {
                  setShowAssignmentForm(false);
                  setSelectedSubject(null);
                  setAssignmentData({
                    teacherId: '',
                    classId: '',
                    academicYearId: ''
                  });
                  setErrors({});
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#718096',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAssignTeacher}>
              <div style={{
                marginBottom: '24px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  Select Teacher
                </label>
                <select
                  value={assignmentData.teacherId}
                  onChange={(e) => setAssignmentData({...assignmentData, teacherId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: errors.teacherId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500',
                    color: '#1a202c'
                  }}
                >
                  <option value="">Select Teacher</option>
                  {teachers && teachers.length > 0 ? (
                    teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name || `${teacher.firstName} ${teacher.lastName}` || `Teacher ${teacher.id}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No teachers available</option>
                  )}
                </select>
              </div>

              {errors.submit && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <p style={{
                    color: '#ef4444',
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {errors.submit}
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignmentForm(false);
                    setSelectedSubject(null);
                    setAssignmentData({
                      teacherId: '',
                      classId: '',
                      academicYearId: ''
                    });
                    setErrors({});
                  }}
                  style={{
                    padding: '14px 24px',
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: '#4b5563',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Assigning...' : 'Assign Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;
