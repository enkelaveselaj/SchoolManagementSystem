import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, Calculator, TrendingUp, Users, BookOpen, Award, Download, Target, Clock, FileText } from 'lucide-react';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';

const GradeManagement = () => {
  // Mock teacher ID - in real app this would come from auth context
  const teacherId = 'teacher-1'; 
  
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showBulkGrade, setShowBulkGrade] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    value: 0,
    maxScore: 100,
    assessmentId: '',
    comments: '',
    teacherId: teacherId
  });
  const [bulkGradeData, setBulkGradeData] = useState({
    subjectId: '',
    classId: '',
    sectionId: '',
    assessmentName: '',
    maxScore: 100,
    grades: []
  });
  const [filterStudent, setFilterStudent] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
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
      const [gradesData, studentsData, teacherSubjectsData, classesData, sectionsData] = await Promise.all([
        academicService.getAllGrades().catch(err => {
          console.error('Error fetching grades:', err);
          return [];
        }),
        schoolService.getAllStudents().catch(err => {
          console.error('Error fetching students:', err);
          return [];
        }),
        academicService.getTeacherSubjects(teacherId).catch(err => {
          console.error('Error fetching teacher subjects:', err);
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
      
      // Filter grades to only show those for teacher's subjects
      const teacherGrades = gradesData.filter(grade => 
        teacherSubjectsData.some(subject => subject.id === grade.subjectId)
      );
      
      setGrades(teacherGrades);
      setStudents(studentsData);
      setSubjects(teacherSubjectsData);
      setClasses(classesData);
      setSections(sectionsData);
      setErrors({});
    } catch (err) {
      console.error('Error loading grade data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const gradeData = {
        ...formData,
        value: parseFloat(formData.value),
        maxScore: parseInt(formData.maxScore)
      };

      if (editingGrade) {
        await academicService.updateGrade(editingGrade.id, gradeData);
      } else {
        await academicService.createGrade(gradeData);
      }

      await loadData();
      setShowForm(false);
      setEditingGrade(null);
      setFormData({
        studentId: '',
        subjectId: '',
        value: 0,
        maxScore: 100,
        assessmentId: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error saving grade:', error);
      setErrors({ submit: 'Failed to save grade. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkGradeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const gradesToCreate = bulkGradeData.grades.map(grade => ({
        studentId: grade.studentId,
        subjectId: bulkGradeData.subjectId,
        value: parseFloat(grade.value),
        maxScore: parseInt(bulkGradeData.maxScore),
        assessmentId: bulkGradeData.assessmentName,
        comments: grade.comments || ''
      }));

      for (const grade of gradesToCreate) {
        await academicService.createGrade(grade);
      }

      await loadData();
      setShowBulkGrade(false);
      setBulkGradeData({
        subjectId: '',
        classId: '',
        assessmentName: '',
        maxScore: 100,
        grades: []
      });
    } catch (error) {
      console.error('Error saving bulk grades:', error);
      setErrors({ submit: 'Failed to save bulk grades. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId || '',
      subjectId: grade.subjectId || '',
      value: grade.value || 0,
      maxScore: grade.maxScore || 100,
      assessmentId: grade.assessmentId || '',
      comments: grade.comments || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await academicService.deleteGrade(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting grade:', error);
      }
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.assessmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        grade.comments?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = !filterStudent || grade.studentId === filterStudent;
    const matchesSubject = !filterSubject || grade.subjectId === filterSubject;
    const matchesClass = !filterClass || grade.student?.classId === filterClass;
    const matchesSection = !filterSection || grade.student?.sectionId === filterSection;
    return matchesSearch && matchesStudent && matchesSubject && matchesClass && matchesSection;
  });

  const getGradeColor = (grade, maxScore) => {
    const percentage = (grade / maxScore) * 100;
    if (percentage >= 90) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 70) return '#8b5cf6';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getGradeGradient = (grade, maxScore) => {
    const percentage = (grade / maxScore) * 100;
    if (percentage >= 90) return 'linear-gradient(135deg, #10b981, #059669)';
    if (percentage >= 80) return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    if (percentage >= 70) return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    if (percentage >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    return 'linear-gradient(135deg, #ef4444, #dc2626)';
  };

  const getGradeLetter = (grade, maxScore) => {
    const percentage = (grade / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const initializeBulkGrades = () => {
    if (!bulkGradeData.classId) return;
    
    const classStudents = students.filter(student => student.classId === bulkGradeData.classId);
    const grades = classStudents.map(student => ({
      studentId: student.id,
      studentName: student.name,
      value: 0,
      comments: ''
    }));
    
    setBulkGradeData(prev => ({ ...prev, grades }));
  };

  useEffect(() => {
    initializeBulkGrades();
  }, [bulkGradeData.classId, students]);

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
            Loading Grades...
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
            <Calculator size={28} />
          </div>
          Grade Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Manage student grades and academic performance.
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
              placeholder="Search grades..."
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
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              fontWeight: '500',
              color: '#1a202c',
              minWidth: '180px'
            }}
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              fontWeight: '500',
              color: '#1a202c',
              minWidth: '180px'
            }}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          
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
            {sections.map(section => (
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
            onClick={() => setShowBulkGrade(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={18} />
            Bulk Grade
          </button>
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
            New Grade
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
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Calculator size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Total Grades
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {grades.length}
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
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Target size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Average Grade
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {(grades.length > 0 
                  ? (grades.reduce((sum, g) => sum + (parseFloat(g.value || 0) / parseFloat(g.maxScore || 1) * 100), 0) / grades.length).toFixed(1)
                  : '0'
                )}%
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
                Passing Rate
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {(grades.length > 0 
                  ? (grades.filter(g => (parseFloat(g.value || 0) / parseFloat(g.maxScore || 1) * 100) >= 60).length / grades.length * 100).toFixed(1)
                  : '0'
                )}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredGrades.length === 0 ? (
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
              No grades found
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              margin: '0'
            }}>
              {searchTerm || filterStudent || filterSubject || filterClass 
                ? 'No matching grades found' 
                : 'No grades available'}
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
                    Student
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
                    Assessment
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
                    Grade
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
                    Status
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
                {filteredGrades.map((grade, index) => (
                  <tr
                    key={grade.id}
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
                          {students.find(s => s.id === grade.studentId)?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '2px'
                          }}>
                            {students.find(s => s.id === grade.studentId)?.name || 'Unknown'}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#718096'
                          }}>
                            ID: {grade.studentId}
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
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <BookOpen size={16} style={{ color: '#667eea' }} />
                        {subjects.find(s => s.id === grade.subjectId)?.name || 'Unknown'}
                      </div>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      fontSize: '14px',
                      color: '#4a5568',
                      fontWeight: '500',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FileText size={16} style={{ color: '#667eea' }} />
                        {grade.assessmentId || 'N/A'}
                      </div>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: getGradeColor(grade.value, grade.maxScore),
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '800'
                        }}>
                          {grade.value}/{grade.maxScore}
                        </div>
                        <div style={{
                          width: '80px',
                          height: '6px',
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div
                            style={{
                              width: `${(grade.value / grade.maxScore) * 100}%`,
                              height: '100%',
                              background: getGradeGradient(grade.value, grade.maxScore),
                              borderRadius: '3px',
                              transition: 'all 0.3s ease'
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'center',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
                    }}>
                      <div
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'white',
                          background: getGradeGradient(grade.value, grade.maxScore),
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {getGradeLetter(grade.value, grade.maxScore)}
                      </div>
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
                          onClick={() => handleEdit(grade)}
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
                          onClick={() => handleDelete(grade.id)}
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

      {/* Individual Grade Form Modal */}
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
                  {editingGrade ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                {editingGrade ? 'Edit Grade' : 'Add New Grade'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGrade(null);
                  setFormData({
                    studentId: '',
                    subjectId: '',
                    value: 0,
                    maxScore: 100,
                    assessmentId: '',
                    comments: ''
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
                    Student
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.studentId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
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
                    Subject
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.subjectId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
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
                    Assessment
                  </label>
                  <input
                    type="text"
                    value={formData.assessmentId}
                    onChange={(e) => setFormData({...formData, assessmentId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.assessmentId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                    placeholder="Assessment name"
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
                    Grade
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    min="0"
                    max={formData.maxScore}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.value ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
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
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({...formData, maxScore: e.target.value})}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.maxScore ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  />
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
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: errors.comments ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    minHeight: '100px',
                    resize: 'vertical',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500',
                    color: '#1a202c'
                  }}
                  placeholder="Add comments about this grade..."
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
                    setEditingGrade(null);
                    setFormData({
                      studentId: '',
                      subjectId: '',
                      value: 0,
                      maxScore: 100,
                      assessmentId: '',
                      comments: ''
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
                  {submitting ? 'Saving...' : (editingGrade ? 'Update Grade' : 'Add Grade')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Grade Form Modal */}
      {showBulkGrade && (
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
            maxWidth: '900px',
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
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Download size={20} />
                </div>
                Bulk Grade Entry
              </h2>
              <button
                onClick={() => {
                  setShowBulkGrade(false);
                  setBulkGradeData({
                    subjectId: '',
                    classId: '',
                    assessmentName: '',
                    maxScore: 100,
                    grades: []
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

            <form onSubmit={handleBulkGradeSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
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
                    Subject
                  </label>
                  <select
                    value={bulkGradeData.subjectId}
                    onChange={(e) => setBulkGradeData({...bulkGradeData, subjectId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.subjectId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
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
                    Class
                  </label>
                  <select
                    value={bulkGradeData.classId}
                    onChange={(e) => setBulkGradeData({...bulkGradeData, classId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.classId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
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
                    Assessment Name
                  </label>
                  <input
                    type="text"
                    value={bulkGradeData.assessmentName}
                    onChange={(e) => setBulkGradeData({...bulkGradeData, assessmentName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.assessmentName ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                    placeholder="e.g., Midterm Exam"
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
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={bulkGradeData.maxScore}
                    onChange={(e) => setBulkGradeData({...bulkGradeData, maxScore: e.target.value})}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.maxScore ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                  />
                </div>
              </div>

              {bulkGradeData.grades.length > 0 && (
                <div style={{
                  marginBottom: '32px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: '0 0 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Users size={20} />
                    Student Grades ({bulkGradeData.grades.length})
                  </h3>
                  <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    {bulkGradeData.grades.map((grade, index) => (
                      <div
                        key={grade.studentId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          padding: '20px 24px',
                          borderBottom: '1px solid rgba(102, 126, 234, 0.05)',
                          backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                          transition: 'all 0.3s ease'
                        }}
                      >
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
                          fontWeight: '700',
                          flexShrink: 0
                        }}>
                          {grade.studentName?.charAt(0) || '?'}
                        </div>
                        <div style={{
                          flex: 1,
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1a202c'
                        }}>
                          {grade.studentName}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <input
                            type="number"
                            value={grade.value}
                            onChange={(e) => {
                              const updatedGrades = [...bulkGradeData.grades];
                              updatedGrades[index].value = e.target.value;
                              setBulkGradeData({...bulkGradeData, grades: updatedGrades});
                            }}
                            min="0"
                            max={bulkGradeData.maxScore}
                            style={{
                              width: '100px',
                              padding: '10px 12px',
                              border: '1px solid rgba(102, 126, 234, 0.3)',
                              borderRadius: '10px',
                              fontSize: '15px',
                              background: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: '600',
                              color: '#1a202c',
                              textAlign: 'center'
                            }}
                          />
                          <span style={{
                            fontSize: '13px',
                            color: '#718096',
                            fontWeight: '500'
                          }}>
                            /{bulkGradeData.maxScore}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={grade.comments}
                          onChange={(e) => {
                            const updatedGrades = [...bulkGradeData.grades];
                            updatedGrades[index].comments = e.target.value;
                            setBulkGradeData({...bulkGradeData, grades: updatedGrades});
                          }}
                          style={{
                            width: '200px',
                            padding: '10px 12px',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '10px',
                            fontSize: '14px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: '500',
                            color: '#1a202c'
                          }}
                          placeholder="Comments"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    setShowBulkGrade(false);
                    setBulkGradeData({
                      subjectId: '',
                      classId: '',
                      assessmentName: '',
                      maxScore: 100,
                      grades: []
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
                  disabled={submitting || bulkGradeData.grades.length === 0}
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: (submitting || bulkGradeData.grades.length === 0) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    opacity: (submitting || bulkGradeData.grades.length === 0) ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Saving...' : `Save ${bulkGradeData.grades.length} Grades`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;
