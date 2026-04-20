import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Award, TrendingUp, Clock, Target, UserCheck, FileText, BarChart3, Activity, GraduationCap } from 'lucide-react';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { studentAPI } from '../../services/teacherStudentService';

const TeacherDashboard = () => {
  console.log('TeacherDashboard component rendering');
  const [dashboardData, setDashboardData] = useState({
    assessments: [],
    grades: [],
    subjects: [],
    classes: [],
    students: [],
    recentAssessments: [],
    gradeStats: { average: 0, highest: 0, lowest: 0, total: 0 },
    upcomingAssessments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    loadTeacherDashboardData();
  }, []);

  const loadTeacherDashboardData = async () => {
    try {
      setLoading(true);
      const teacherId = 'teacher-1'; // Mock teacher ID
      
      const [assessmentsData, gradesData, subjectsData, classesData, studentsData] = await Promise.all([
        academicService.getAllAssessments().catch(err => {
          console.error('Error fetching assessments:', err);
          return [];
        }),
        academicService.getAllGrades().catch(err => {
          console.error('Error fetching grades:', err);
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
        studentAPI.getAllStudents().catch(err => {
          console.error('Error fetching students:', err);
          return [];
        })
      ]);
      
      // Filter data to only show teacher's assigned subjects
      const teacherAssessments = assessmentsData.filter(assessment => 
        subjectsData.some(subject => subject.id === assessment.subjectId)
      );
      
      const teacherGrades = gradesData.filter(grade => 
        subjectsData.some(subject => subject.id === grade.subjectId)
      );
      
      console.log('Dashboard - Teacher subjects:', subjectsData);
      console.log('Dashboard - Teacher assessments:', teacherAssessments);
      console.log('Dashboard - Teacher grades:', teacherGrades);
      
      // Calculate statistics
      const gradeStats = {
        average: teacherGrades.length > 0 ? 
          teacherGrades.reduce((sum, grade) => sum + (grade.score || 0), 0) / teacherGrades.length : 0,
        highest: teacherGrades.length > 0 ? 
          Math.max(...teacherGrades.map(grade => grade.score || 0)) : 0,
        lowest: teacherGrades.length > 0 ? 
          Math.min(...teacherGrades.map(grade => grade.score || 0)) : 0,
        total: teacherGrades.length
      };
      
      // Get recent assessments (last 5)
      const recentAssessments = teacherAssessments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      
      setDashboardData({
        assessments: teacherAssessments,
        grades: teacherGrades,
        subjects: subjectsData,
        classes: classesData,
        students: studentsData,
        recentAssessments,
        gradeStats
      });
      
      setError(null);
    } catch (err) {
      console.error('Error loading teacher dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = {
    assessments: dashboardData.assessments.filter(a => 
      (!selectedClass || a.classId === selectedClass) &&
      (!selectedSubject || a.subjectId === selectedSubject)
    ),
    grades: dashboardData.grades.filter(g => 
      (!selectedClass || g.classId === selectedClass) &&
      (!selectedSubject || g.subjectId === selectedSubject)
    )
  };

  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade || 0);
    if (numGrade >= 90) return '#10b981';
    if (numGrade >= 80) return '#3b82f6';
    if (numGrade >= 70) return '#8b5cf6';
    if (numGrade >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getGradeStatus = (grade) => {
    const numGrade = parseFloat(grade || 0);
    return numGrade >= 60 ? 'Pass' : 'Fail';
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
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <AlertCircle size={48} style={{ color: '#ef4444' }} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a202c',
            margin: '16px 0 8px 0'
          }}>
            Error Loading Dashboard
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#718096',
            margin: '0'
          }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '0'
    }}>
      {/* Dashboard Header */}
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
          Dashboard Overview
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Welcome back! Here's your academic performance overview.
        </p>
      </div>

      {/* Filter Controls */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            fontWeight: '500',
            color: '#1a202c',
            minWidth: '200px'
          }}
        >
          <option value="">All Classes</option>
          {dashboardData.classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            fontWeight: '500',
            color: '#1a202c',
            minWidth: '200px'
          }}
        >
          <option value="">All Subjects</option>
          {dashboardData.subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Compact Statistics Cards */}
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
              <Users size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Students
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {dashboardData.students.length}
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
              <BookOpen size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Subjects
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {dashboardData.subjects.length}
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
              <Award size={28} />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#718096',
                marginBottom: '4px'
              }}>
                Assessments
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {filteredData.assessments.length}
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
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                Avg Grade
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                lineHeight: 1
              }}>
                {dashboardData.gradeStats.average}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        {/* Recent Activities */}
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '20px 24px',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Activity size={20} />
                Recent Activities
              </div>
            </div>
            
            <div style={{
              padding: '24px'
            }}>
              <div style={{
                marginBottom: '24px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a202c',
                  margin: '0 0 16px 0'
                }}>
                  Recent Assessments
                </h4>
                {dashboardData.recentAssessments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#718096'
                  }}>
                    <AlertCircle size={32} style={{ color: '#cbd5e0', marginBottom: '12px' }} />
                    <p style={{
                      fontSize: '14px',
                      margin: 0
                    }}>
                      No recent assessments
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {dashboardData.recentAssessments.map((assessment, index) => (
                      <div
                        key={assessment.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'rgba(102, 126, 234, 0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '4px'
                          }}>
                            {assessment.title}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: '#718096',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {assessment.type}
                            </span>
                            <span>·</span>
                            <span>{new Date(assessment.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: getGradeColor(assessment.score),
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {assessment.score}/{assessment.maxScore}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Assessments */}
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '20px 24px',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Zap size={20} />
                Upcoming
              </div>
            </div>
            
            <div style={{
              padding: '24px'
            }}>
              {dashboardData.upcomingAssessments.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#718096'
                }}>
                  <Clock size={32} style={{ color: '#cbd5e0', marginBottom: '12px' }} />
                  <p style={{
                    fontSize: '14px',
                    margin: 0
                  }}>
                    No upcoming assessments
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {dashboardData.upcomingAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#1a202c',
                          marginBottom: '6px'
                        }}>
                          {assessment.title}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#718096',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {assessment.type}
                          </span>
                          <span>·</span>
                          <span>{new Date(assessment.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#10b981'
                      }}>
                        <Clock size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginTop: '24px'
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
          <BarChart3 size={20} />
          Grade Distribution
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '12px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              A
            </div>
            <div style={{
              fontSize: '13px',
              color: '#718096',
              fontWeight: '600'
            }}>
              Excellent
            </div>
          </div>
          
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '12px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}>
              B
            </div>
            <div style={{
              fontSize: '13px',
              color: '#718096',
              fontWeight: '600'
            }}>
              Good
            </div>
          </div>
          
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '12px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}>
              C
            </div>
            <div style={{
              fontSize: '13px',
              color: '#718096',
              fontWeight: '600'
            }}>
              Average
            </div>
          </div>
          
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '12px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}>
              D/F
            </div>
            <div style={{
              fontSize: '13px',
              color: '#718096',
              fontWeight: '600'
            }}>
              Below Avg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
