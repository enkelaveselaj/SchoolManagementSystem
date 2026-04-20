import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Search, Filter, Check, X, AlertCircle, UserCheck, ChevronRight } from 'lucide-react';
import { studentAPI } from '../../services/teacherStudentService';
import schoolService from '../../services/schoolService';

const StudentClassAssignment = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadSections();
    } else {
      setSections([]);
      setSelectedSection('');
    }
  }, [selectedClass]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, classesData] = await Promise.all([
        studentAPI.getAllStudents().catch(err => {
          console.error('Error fetching students:', err);
          return [];
        }),
        schoolService.getAllClasses().catch(err => {
          console.error('Error fetching classes:', err);
          return [];
        })
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const sectionsData = await schoolService.getAllSections();
      const classSections = sectionsData.filter(section => section.classId === parseInt(selectedClass));
      setSections(classSections);
    } catch (err) {
      console.error('Error loading sections:', err);
      setSections([]);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const filteredStudentIds = filteredStudents.map(student => student.id);
    setSelectedStudents(filteredStudentIds);
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  const handleAssignToClass = async () => {
    if (!selectedClass) {
      setErrors({ submit: 'Please select a class' });
      return;
    }

    if (selectedStudents.length === 0) {
      setErrors({ submit: 'Please select at least one student' });
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      
      const updatePromises = selectedStudents.map(studentId => 
        studentAPI.updateStudent(studentId, {
          classId: parseInt(selectedClass),
          sectionId: selectedSection ? parseInt(selectedSection) : null
        })
      );

      await Promise.all(updatePromises);
      
      setSuccessMessage(`Successfully assigned ${selectedStudents.length} student(s) to class`);
      setSelectedStudents([]);
      
      // Reload data to show updated assignments
      await loadData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error assigning students to class:', err);
      setErrors({ submit: 'Failed to assign students to class. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getClassName = (classId) => {
    if (!classId) return 'Not Assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  const getSectionName = (sectionId) => {
    if (!sectionId) return 'No Section';
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : 'Unknown Section';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Only show unassigned students for assignment
    const matchesStatus = !student.classId;
    
    // Apply additional filter if "unassigned" is selected
    const additionalFilter = filterStatus === 'unassigned' ? !student.classId : true;
    
    return matchesSearch && matchesStatus && additionalFilter;
  });

  const unassignedCount = students.filter(s => !s.classId).length;
  const assignedCount = students.filter(s => s.classId).length;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
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
          Loading student assignment data...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
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
            <UserCheck size={28} />
          </div>
          Student Class Assignment
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Assign students to classes and manage class enrollments.
        </p>
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
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Check size={24} />
            </div>
            <div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0'
              }}>
                {assignedCount}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                fontWeight: '500'
              }}>
                Assigned
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <X size={24} />
            </div>
            <div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0'
              }}>
                {unassignedCount}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#718096',
                fontWeight: '500'
              }}>
                Unassigned
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
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
          flexWrap: 'wrap',
          alignItems: 'center'
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
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="all">All Unassigned Students</option>
            <option value="unassigned">Only Unassigned</option>
          </select>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={handleSelectAll}
            style={{
              padding: '8px 16px',
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Select All
          </button>
          <button
            onClick={handleClearSelection}
            style={{
              padding: '8px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Assignment Controls */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1a202c',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BookOpen size={20} />
            Class Assignment
          </h3>
          <div style={{
            fontSize: '14px',
            color: '#667eea',
            fontWeight: '600',
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '4px 12px',
            borderRadius: '20px'
          }}>
            {selectedStudents.length} selected
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a5568',
              marginBottom: '8px'
            }}>
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.classId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                fontWeight: '500',
                color: '#1a202c'
              }}
            >
              <option value="">Select a class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} (Grade {cls.gradeLevel})
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a5568',
              marginBottom: '8px'
            }}>
              Select Section (Optional)
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.sectionId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                background: selectedClass ? 'rgba(255, 255, 255, 0.9)' : 'rgba(243, 244, 246, 0.9)',
                backdropFilter: 'blur(10px)',
                fontWeight: '500',
                color: selectedClass ? '#1a202c' : '#9ca3af'
              }}
            >
              <option value="">Select a section</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAssignToClass}
            disabled={submitting || !selectedClass || selectedStudents.length === 0}
            style={{
              padding: '12px 24px',
              background: submitting || !selectedClass || selectedStudents.length === 0 
                ? 'rgba(156, 163, 175, 0.5)' 
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: submitting || !selectedClass || selectedStudents.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: submitting || !selectedClass || selectedStudents.length === 0 
                ? 'none' 
                : '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-end'
            }}
          >
            {submitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Assigning...
              </>
            ) : (
              <>
                <UserCheck size={18} />
                Assign to Class
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Check size={20} style={{ color: '#10b981' }} />
          <span style={{
            color: '#065f46',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {successMessage}
          </span>
        </div>
      )}

      {errors.submit && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} style={{ color: '#ef4444' }} />
          <span style={{
            color: '#991b1b',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {errors.submit}
          </span>
        </div>
      )}

      {/* Students List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'rgba(102, 126, 234, 0.05)',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1a202c',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Users size={20} />
            Unassigned Students ({filteredStudents.length})
          </h3>
        </div>
        
        {filteredStudents.length > 0 ? (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                style={{
                  padding: '16px 24px',
                  borderBottom: index < filteredStudents.length - 1 ? '1px solid rgba(102, 126, 234, 0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  background: selectedStudents.includes(student.id) 
                    ? 'rgba(102, 126, 234, 0.05)' 
                    : 'transparent'
                }}
                onClick={() => handleStudentSelect(student.id)}
                onMouseEnter={(e) => {
                  if (!selectedStudents.includes(student.id)) {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedStudents.includes(student.id)) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleStudentSelect(student.id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#667eea',
                    cursor: 'pointer'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '4px'
                      }}>
                        {student.firstName} {student.lastName}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#718096'
                      }}>
                        {student.email}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#d97706',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Available for Assignment
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    {student.phone && <span>📱 {student.phone}</span>}
                    {student.parentName && <span>👤 {student.parentName}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px'
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
              <Users size={32} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 12px'
            }}>No Students Found</h3>
            <p style={{
              fontSize: '16px',
              color: '#718096',
              margin: 0
            }}>
              {searchTerm || filterStatus === 'unassigned'
                ? 'No unassigned students match your search criteria.'
                : 'All students are currently assigned to classes.'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StudentClassAssignment;
