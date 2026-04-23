import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, BookOpen, Award, Calculator, Download, RefreshCw, AlertCircle, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';
import { studentAPI } from '../../services/teacherStudentService';

const GradeManagement = () => {
  const [calculatedGrades, setCalculatedGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterStudent, setFilterStudent] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Starting data load...');
      
      const [subjectsData, classesData, studentsData] = await Promise.all([
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
      
      console.log('Data loaded:', { subjectsData, classesData, studentsData });
      
      setSubjects(subjectsData);
      setClasses(classesData);
      setStudents(studentsData);
      setErrors({});
      
      // Calculate grades after loading data
      await calculateAllGrades();
    } catch (err) {
      console.error('Error loading grade data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAllGrades = async () => {
    try {
      setCalculating(true);
      console.log('Starting grade calculation...');
      console.log('Students available:', students);
      console.log('Subjects available:', subjects);
      
      if (!students || students.length === 0) {
        console.log('No students available for grade calculation');
        setCalculatedGrades([]);
        return;
      }
      
      if (!subjects || subjects.length === 0) {
        console.log('No subjects available for grade calculation');
        setCalculatedGrades([]);
        return;
      }
      
      const grades = [];
      
      // Calculate grades for each student and subject combination
      for (const student of students) {
        for (const subject of subjects) {
          try {
            const gradeData = await academicService.calculateStudentGrade(student.id, subject.id);
            console.log('Grade data received:', gradeData);
            
            if (gradeData && gradeData.averageScore > 0) {
              grades.push({
                studentId: student.id,
                studentName: `${student.firstName} ${student.lastName}`,
                subjectId: subject.id,
                subjectName: subject.name,
                averageScore: gradeData.averageScore,
                grade: gradeData.grade,
                gradeValue: gradeData.gradeValue
              });
              console.log('Grade added to list');
            } else {
              console.log('No grade data or average score is 0');
            }
          } catch (error) {
            console.log(`Error calculating grade for student ${student.id}, subject ${subject.id}:`, error.message);
            // Skip if no scores exist for this student/subject
            continue;
          }
        }
      }
      
      console.log('Final calculated grades:', grades);
      setCalculatedGrades(grades);
    } catch (err) {
      console.error('Error calculating grades:', err);
    } finally {
      setCalculating(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return '#10b981';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#f97316';
      case 'F': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getGradeIcon = (grade) => {
    switch (grade) {
      case 'A': return <TrendingUp size={16} color="#10b981" />;
      case 'B': return <TrendingUp size={16} color="#3b82f6" />;
      case 'C': return <BarChart3 size={16} color="#f59e0b" />;
      case 'D': return <TrendingDown size={16} color="#f97316" />;
      case 'F': return <AlertCircle size={16} color="#ef4444" />;
      default: return <AlertCircle size={16} color="#6b7280" />;
    }
  };

  const filteredGrades = calculatedGrades.filter(grade => {
    // Search filter
    if (searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = grade.studentName.toLowerCase().includes(searchLower);
      const subjectMatch = grade.subjectName.toLowerCase().includes(searchLower);
      const gradeMatch = grade.grade.toLowerCase().includes(searchLower);
      if (!nameMatch && !subjectMatch && !gradeMatch) return false;
    }
    
    // Student filter
    if (filterStudent !== '') {
      if (grade.studentId.toString() !== filterStudent) return false;
    }
    
    // Subject filter
    if (filterSubject !== '') {
      if (grade.subjectId.toString() !== filterSubject) return false;
    }
    
    return true;
  });

  const gradesByStudent = filteredGrades.reduce((acc, grade) => {
    if (!acc[grade.studentId]) {
      acc[grade.studentId] = {
        studentName: grade.studentName,
        grades: []
      };
    }
    acc[grade.studentId].grades.push(grade);
    return acc;
  }, {});

  const refreshGrades = () => {
    calculateAllGrades();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading grade data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1f2937' }}>Student Grades</h2>
        <button
          onClick={refreshGrades}
          disabled={calculating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: calculating ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: calculating ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <RefreshCw size={16} className={calculating ? 'animate-spin' : ''} />
          {calculating ? 'Calculating...' : 'Refresh Grades'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Search size={16} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Search</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students, subjects, or grades..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Student</span>
          </div>
          <select
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={16} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Subject</span>
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(gradesByStudent).length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <Calculator size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 16px 0', color: '#6b7280' }}>No Grades Available</h3>
          <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: '14px' }}>
            {calculating ? 'Calculating grades...' : 'Start by adding assessment scores in the Assessment section'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(gradesByStudent).map(([studentId, studentData]) => (
            <div key={studentId} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    {studentData.studentName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div>
                      <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                        {studentData.studentName}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                        {studentData.grades.length} subject{studentData.grades.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {studentData.grades.map((grade, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: '8px',
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          {grade.subjectName}
                        </span>
                        <span style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: getGradeColor(grade.grade),
                          marginLeft: '8px'
                        }}>
                          {grade.grade}
                        </span>
                        {getGradeIcon(grade.grade)}
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          backgroundColor: getGradeColor(grade.grade),
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        GPA: {grade.gradeValue.toFixed(2)} • {grade.averageScore.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GradeManagement;