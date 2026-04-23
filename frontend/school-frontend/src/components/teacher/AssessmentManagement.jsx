import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Check, X, AlertCircle, BookOpen, Users, Clock, Calendar, Award, Target, UserCheck, FileText, Save, User } from 'lucide-react';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { studentAPI } from '../../services/teacherStudentService';

const AssessmentManagement = () => {
  // Mock teacher ID - in real app this would come from auth context
  const teacherId = 'teacher-1'; 
  
  const [assessments, setAssessments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showScoringForm, setShowScoringForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Quiz',
    maxScore: 100,
    weight: 10,
    date: new Date().toISOString().split('T')[0],
    subjectId: '',
    classId: '',
    teacherId: teacherId
  });
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assessmentsData, subjectsData, classesData, studentsData] = await Promise.all([
        academicService.getAllAssessments().catch(err => {
          console.error('Error fetching assessments:', err);
          return [];
        }),
        academicService.getAllSubjects().catch(err => {
          console.error('Error fetching subjects:', err);
          return [];
        }),
        schoolService.getAllClasses().catch(err => {
          console.error('Error fetching classes:', err);
          return [];
        }),
        studentAPI.getAllStudents().catch(err => {
          console.error('Error fetching students:', err);
          return [];
        })
      ]);
      
      console.log('All subjects loaded:', subjectsData);
      console.log('All assessments loaded:', assessmentsData);
      
      setAssessments(assessmentsData);
      setSubjects(subjectsData);
      setClasses(classesData);
      setStudents(studentsData);
      setErrors({});
    } catch (err) {
      console.error('Error loading assessment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const assessmentData = {
        ...formData,
        maxScore: parseInt(formData.maxScore),
        weight: parseFloat(formData.weight)
      };

      if (editingAssessment) {
        await academicService.updateAssessment(editingAssessment.id, assessmentData);
      } else {
        await academicService.createAssessment(assessmentData);
      }

      await loadData();
      setShowForm(false);
      setEditingAssessment(null);
      setFormData({
        title: '',
        type: 'Quiz',
        weight: 10,
        date: new Date().toISOString().split('T')[0],
        subjectId: '',
        classId: '',
        teacherId: teacherId
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      setErrors({ submit: 'Failed to save assessment. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || '',
      type: assessment.type || 'Quiz',
      maxScore: assessment.maxScore || 100,
      weight: assessment.weight || 10,
      date: assessment.date ? new Date(assessment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      subjectId: assessment.subjectId || '',
      classId: assessment.classId || '',
      teacherId: assessment.teacherId || teacherId
    });
    setShowForm(true);
  };

  const handleScoreStudents = async (assessment) => {
    try {
      setSelectedAssessment(assessment);
      
      // Get students for the assessment's class (or all students if no class specified)
      // For now, show all students since class filtering isn't working properly
      const classStudents = students;
      
      // Get existing scores for this assessment
      const existingScores = await academicService.getScoresByAssessment(assessment.id);
      const scoresMap = new Map(existingScores.map(score => [score.studentId, score]));
      
      // Initialize student scores with existing scores if available
      const initialScores = classStudents.map(student => {
        const existingScore = scoresMap.get(student.id);
        return {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          score: existingScore ? existingScore.score : 0,
          maxScore: assessment.maxScore || 100,
          remarks: existingScore ? existingScore.remarks || '' : ''
        };
      });
      
      setStudentScores(initialScores);
      setShowScoringForm(true);
    } catch (error) {
      console.error('Error preparing student scoring:', error);
      setErrors({ submit: 'Failed to prepare student scoring. Please try again.' });
    }
  };

  const handleSaveScores = async () => {
    try {
      setSubmitting(true);
      setErrors({});

      const scoresData = studentScores.map(score => ({
        studentId: score.studentId,
        score: parseFloat(score.score),
        remarks: score.remarks || ''
      }));

      // Use batch create for better performance
      await academicService.batchCreateScores(selectedAssessment.id, scoresData);

      await loadData();
      setShowScoringForm(false);
      setSelectedAssessment(null);
      setStudentScores([]);
    } catch (error) {
      console.error('Error saving student scores:', error);
      setErrors({ submit: 'Failed to save student scores. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateStudentScore = (studentId, score) => {
    setStudentScores(prevScores => 
      prevScores.map(s => 
        s.studentId === studentId 
          ? { ...s, score: Math.min(Math.max(0, score), s.maxScore) }
          : s
      )
    );
  };

  const updateStudentRemarks = (studentId, remarks) => {
    setStudentScores(prevScores => 
      prevScores.map(s => 
        s.studentId === studentId 
          ? { ...s, remarks }
          : s
      )
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await academicService.deleteAssessment(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || assessment.subjectId === filterSubject;
    const matchesType = !filterType || assessment.type === filterType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      Quiz: '#10b981',
      Exam: '#8b5cf6',
      Assignment: '#3b82f6',
      Project: '#f59e0b'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeGradient = (type) => {
    const gradients = {
      Quiz: 'linear-gradient(135deg, #10b981, #059669)',
      Exam: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      Assignment: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      Project: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    return gradients[type] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

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
            Loading Assessments...
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
            <FileText size={28} />
          </div>
          Assessment Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Create and manage student assessments and evaluations.
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
              placeholder="Search assessments..."
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
            <option value="Quiz">Quiz</option>
            <option value="Exam">Exam</option>
            <option value="Assignment">Assignment</option>
            <option value="Project">Project</option>
          </select>
        </div>
        
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
          New Assessment
        </button>
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
              <Award size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Total Assessments
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {assessments.length}
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
                Average Score
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {assessments.length > 0 
                  ? (assessments.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / assessments.length).toFixed(1)
                  : '0'
                }
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Clock size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Upcoming
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {assessments.filter(a => new Date(a.date) >= new Date()).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredAssessments.length === 0 ? (
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
              No assessments found
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              margin: '0'
            }}>
              {searchTerm || filterSubject || filterType 
                ? 'No matching assessments found' 
                : 'No assessments available'}
            </p>
          </div>
        ) : (
          <div style={{
            padding: '24px'
          }}>
            {filteredAssessments.map((assessment) => (
              <div
                key={assessment.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '16px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    flex: 1
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '12px'
                    }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: getTypeGradient(assessment.type),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '700',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {assessment.type.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1a202c',
                          margin: '0 0 6px 0',
                          lineHeight: 1.2
                        }}>
                          {assessment.title}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            background: getTypeGradient(assessment.type),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {assessment.type}
                          </span>
                          <span style={{
                            fontSize: '13px',
                            color: '#718096',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Calendar size={14} />
                            {new Date(assessment.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      marginTop: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          color: '#718096',
                          fontWeight: '500'
                        }}>
                          Score:
                        </span>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '800',
                          color: getTypeColor(assessment.type)
                        }}>
                          {assessment.score}/{assessment.maxScore}
                        </div>
                      </div>
                      
                      <div style={{
                        width: '120px',
                        height: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${(assessment.score / assessment.maxScore) * 100}%`,
                            height: '100%',
                            background: getTypeGradient(assessment.type),
                            borderRadius: '4px',
                            transition: 'all 0.3s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => handleEdit(assessment)}
                      style={{
                        padding: '10px 16px',
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
                      onClick={() => handleScoreStudents(assessment)}
                      style={{
                        padding: '10px 16px',
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
                      <Target size={16} />
                      Score
                    </button>
                    <button
                      onClick={() => handleDelete(assessment.id)}
                      style={{
                        padding: '10px 16px',
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Form Modal */}
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
                  {editingAssessment ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAssessment(null);
                  setFormData({
                    title: '',
                    type: 'Quiz',
                    score: 0,
                    maxScore: 100,
                    weight: 10,
                    date: new Date().toISOString().split('T')[0],
                    studentId: '',
                    subjectId: '',
                    teacherId: ''
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
                <div style={{
                  gridColumn: '1 / -1'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.title ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '500',
                      color: '#1a202c'
                    }}
                    placeholder="Enter assessment title"
                  />
                  {errors.title && (
                    <p style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      marginTop: '6px',
                      fontWeight: '500'
                    }}>
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Assessment Type
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
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
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
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.date ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
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

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    min="0"
                    max="100"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.weight ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
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
                    {console.log('Subjects in dropdown:', subjects) || subjects.map(subject => (
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
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
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
                        {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
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
                    setEditingAssessment(null);
                    setFormData({
                      title: '',
                      type: 'Quiz',
                      score: 0,
                      maxScore: 100,
                      weight: 10,
                      date: new Date().toISOString().split('T')[0],
                      studentId: '',
                      subjectId: '',
                      teacherId: ''
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
                  {submitting ? 'Saving...' : (editingAssessment ? 'Update Assessment' : 'Create Assessment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Scoring Modal */}
      {showScoringForm && (
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
                  <Target size={20} />
                </div>
                Score Students - {selectedAssessment?.title}
              </h2>
              <button
                onClick={() => {
                  setShowScoringForm(false);
                  setSelectedAssessment(null);
                  setStudentScores([]);
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

            <div style={{
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '4px'
                  }}>
                    Subject
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>
                    {subjects.find(s => s.id === selectedAssessment?.subjectId)?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '4px'
                  }}>
                    Max Score
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>
                    {selectedAssessment?.maxScore || 100}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '4px'
                  }}>
                    Date
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>
                    {selectedAssessment?.date || 'N/A'}
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0 0 20px 0'
              }}>
                Student Scores ({studentScores.length})
              </h3>
              
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.5)'
              }}>
                {studentScores.map((studentScore, index) => (
                  <div
                    key={studentScore.studentId}
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
                      {studentScore.studentName?.charAt(0) || '?'}
                    </div>
                    <div style={{
                      flex: 1,
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1a202c'
                    }}>
                      {studentScore.studentName}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <input
                        type="number"
                        value={studentScore.score}
                        onChange={(e) => updateStudentScore(studentScore.studentId, parseFloat(e.target.value) || 0)}
                        min="0"
                        max={studentScore.maxScore}
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
                        /{studentScore.maxScore}
                      </span>
                      <input
                        type="text"
                        value={studentScore.remarks || ''}
                        onChange={(e) => updateStudentRemarks(studentScore.studentId, e.target.value)}
                        placeholder="Remarks..."
                        style={{
                          width: '150px',
                          padding: '10px 12px',
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                          borderRadius: '10px',
                          fontSize: '14px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#1a202c'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
                  setShowScoringForm(false);
                  setSelectedAssessment(null);
                  setStudentScores([]);
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
                onClick={handleSaveScores}
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
                {submitting ? 'Saving...' : `Save ${studentScores.length} Scores`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentManagement;
