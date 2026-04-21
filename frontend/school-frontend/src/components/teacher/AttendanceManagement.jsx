import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  XSquare, 
  Clock, 
  AlertCircle, 
  Check, 
  X, 
  Search,
  Filter,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Timer
} from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import { studentAPI } from '../../services/teacherStudentService';
import academicService from '../../services/academicService';
import schoolService from '../../services/schoolService';

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingError, setLoadingError] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(attendanceService.getTodayDate());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [viewMode, setViewMode] = useState('mark'); // 'mark' or 'view'
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [reportStudents, setReportStudents] = useState([]);
  const [selectedReportStudent, setSelectedReportStudent] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedDate) {
      loadExistingAttendance();
    }
  }, [selectedClass, selectedSubject, selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadingError('');
      
      console.log('Loading attendance data...');
      
      const [classesData, subjectsData] = await Promise.all([
        schoolService.getAllClasses().catch(err => {
          console.error('Error fetching classes:', err);
          setLoadingError('Failed to load classes');
          return [];
        }),
        academicService.getAllSubjects().catch(err => {
          console.error('Error fetching subjects:', err);
          setLoadingError('Failed to load subjects');
          return [];
        })
      ]);
      
      console.log('Classes loaded:', classesData);
      console.log('Subjects loaded:', subjectsData);
      
      setClasses(classesData);
      setSubjects(subjectsData);
      
      if (subjectsData.length === 0) {
        setLoadingError('No subjects available. Please check if the academic service is running.');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setLoadingError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    if (!selectedClass) return;
    
    try {
      const studentsData = await studentAPI.getAllStudents();
      const classStudents = studentsData.filter(student => student.classId === parseInt(selectedClass));
      setStudents(classStudents);
      
      // Initialize attendance records for all students
      const initialRecords = classStudents.map(student => ({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        status: 'present',
        checkInTime: '',
        checkOutTime: '',
        notes: '',
        isLate: false,
        lateMinutes: 0
      }));
      
      setAttendanceRecords(initialRecords);
    } catch (err) {
      console.error('Error loading students:', err);
      setErrors({ general: 'Failed to load students' });
    }
  };

  const loadExistingAttendance = async () => {
    if (!selectedClass || !selectedDate) return;
    
    try {
      const response = await attendanceService.getClassAttendance(
        selectedClass,
        selectedDate,
        selectedSubject || undefined
      );
      
      const existingAttendance = response.data;
      
      // Update attendance records with existing data
      if (existingAttendance.length > 0) {
        const updatedRecords = attendanceRecords.map(record => {
          const existing = existingAttendance.find(att => att.studentId === record.studentId);
          if (existing) {
            return {
              ...record,
              status: existing.status,
              checkInTime: existing.checkInTime || '',
              checkOutTime: existing.checkOutTime || '',
              notes: existing.notes || '',
              isLate: existing.isLate || false,
              lateMinutes: existing.lateMinutes || 0,
              attendanceId: existing.id
            };
          }
          return record;
        });
        setAttendanceRecords(updatedRecords);
      }
    } catch (err) {
      console.error('Error loading existing attendance:', err);
      // Don't show error for first load - might be no attendance exists yet
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    } else {
      setStudents([]);
      setAttendanceRecords([]);
    }
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => prev.map(record => {
      if (record.studentId === studentId) {
        const isLate = status === 'late';
        return {
          ...record,
          status,
          isLate,
          lateMinutes: isLate ? (record.lateMinutes || 5) : 0
        };
      }
      return record;
    }));
  };

  const handleTimeChange = (studentId, field, value) => {
    setAttendanceRecords(prev => prev.map(record => {
      if (record.studentId === studentId) {
        return { ...record, [field]: value };
      }
      return record;
    }));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceRecords(prev => prev.map(record => {
      if (record.studentId === studentId) {
        return { ...record, notes };
      }
      return record;
    }));
  };

  const handleLateMinutesChange = (studentId, minutes) => {
    setAttendanceRecords(prev => prev.map(record => {
      if (record.studentId === studentId) {
        return { ...record, lateMinutes: parseInt(minutes) || 0 };
      }
      return record;
    }));
  };

  const handleMarkAll = (status) => {
    setAttendanceRecords(prev => prev.map(record => ({
      ...record,
      status,
      isLate: status === 'late',
      lateMinutes: status === 'late' ? 5 : 0
    })));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !selectedDate) {
      setErrors({ submit: 'Please select class, subject, and date' });
      return;
    }

    if (attendanceRecords.length === 0) {
      setErrors({ submit: 'No students found for this class' });
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      
      const attendanceData = {
        classId: parseInt(selectedClass),
        subjectId: parseInt(selectedSubject),
        teacherId: 1, // This should come from auth context
        date: selectedDate,
        markedBy: 1, // This should come from auth context
        attendanceRecords: attendanceRecords.map(record => ({
          studentId: record.studentId,
          status: record.status,
          checkInTime: record.checkInTime || null,
          checkOutTime: record.checkOutTime || null,
          notes: record.notes || null,
          isLate: record.isLate,
          lateMinutes: record.lateMinutes
        }))
      };

      console.log('Submitting attendance data:', attendanceData);
      console.log('Selected date:', selectedDate);
      console.log('Current date:', attendanceService.getTodayDate());

      const response = await attendanceService.markAttendance(attendanceData);
      console.log('Attendance marking response:', response);
      
      setSuccessMessage(`Attendance marked successfully for ${response.count} students`);
      
      // Reload existing attendance to show updated data
      await loadExistingAttendance();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setErrors({ submit: err.message || 'Failed to mark attendance' });
    } finally {
      setSubmitting(false);
    }
  };

  const loadReportStudents = async () => {
    if (!selectedClass) return;
    
    try {
      const studentsData = await studentAPI.getAllStudents();
      const classStudents = studentsData.filter(student => student.classId === parseInt(selectedClass));
      setReportStudents(classStudents);
    } catch (err) {
      console.error('Error loading report students:', err);
    }
  };

  const loadStudentAttendanceReport = async () => {
    if (!selectedReportStudent) return;
    
    try {
      setReportLoading(true);
      
      // For now, get all attendance data to test
      console.log('Loading ALL student attendance for student ID:', selectedReportStudent);
      console.log('Student ID type:', typeof selectedReportStudent);
      
      // First, let's try to get ALL attendance records to see what's in the database
      const allResponse = await attendanceService.getAttendanceReport({});
      console.log('ALL attendance records in database:', allResponse);
      console.log('Total records in database:', allResponse.data?.length || 0);
      
      // Now get specific student attendance
      const response = await attendanceService.getStudentAttendance(
        selectedReportStudent,
        null,
        null
      );
      
      console.log('Student attendance response (all time):', response);
      console.log('Number of records found:', response.data?.length || 0);
      
      // Check if any records match this student
      const matchingRecords = allResponse.data?.filter(record => 
        record.studentId == selectedReportStudent
      );
      console.log('Matching records for this student:', matchingRecords);
      console.log('Number of matching records:', matchingRecords?.length || 0);
      
      setStudentAttendanceData(response.data || []);
    } catch (err) {
      console.error('Error loading student attendance report:', err);
      setStudentAttendanceData([]);
    } finally {
      setReportLoading(false);
    }
  };

  const loadAttendanceStats = async () => {
    if (!selectedClass) return;
    
    try {
      const dateRange = attendanceService.getCurrentMonthRange();
      const response = await attendanceService.getClassAttendanceStats(
        selectedClass,
        dateRange.startDate,
        dateRange.endDate
      );
      
      setAttendanceStats(response.data);
    } catch (err) {
      console.error('Error loading attendance stats:', err);
    }
  };

  useEffect(() => {
    if (viewMode === 'view' && selectedClass) {
      loadAttendanceStats();
      loadReportStudents();
    }
  }, [viewMode, selectedClass]);

  useEffect(() => {
    if (selectedReportStudent) {
      loadStudentAttendanceReport();
    }
  }, [selectedReportStudent]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckSquare size={16} />;
      case 'absent': return <XSquare size={16} />;
      case 'late': return <Clock size={16} />;
      case 'excused': return <AlertCircle size={16} />;
      default: return null;
    }
  };

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
          Loading attendance data...
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
          Attendance Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: 0
        }}>
          Mark and track student attendance for your classes.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px'
      }}>
        <button
          onClick={() => setViewMode('mark')}
          style={{
            padding: '12px 24px',
            background: viewMode === 'mark' 
              ? 'linear-gradient(135deg, #667eea, #764ba2)' 
              : 'rgba(102, 126, 234, 0.1)',
            color: viewMode === 'mark' ? 'white' : '#667eea',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckSquare size={18} />
          Mark Attendance
        </button>
        <button
          onClick={() => setViewMode('view')}
          style={{
            padding: '12px 24px',
            background: viewMode === 'view' 
              ? 'linear-gradient(135deg, #667eea, #764ba2)' 
              : 'rgba(102, 126, 234, 0.1)',
            color: viewMode === 'view' ? 'white' : '#667eea',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={18} />
          View Reports
        </button>
      </div>

      {/* Controls */}
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
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
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a5568',
              marginBottom: '8px'
            }}>
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedClass}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.subjectId ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                background: selectedClass ? 'rgba(255, 255, 255, 0.9)' : 'rgba(243, 244, 246, 0.9)',
                backdropFilter: 'blur(10px)',
                fontWeight: '500',
                color: selectedClass ? '#1a202c' : '#9ca3af'
              }}
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
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
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={attendanceService.getTodayDate()}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.date ? '2px solid #ef4444' : '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                fontWeight: '500',
                color: '#1a202c'
              }}
            />
          </div>
        </div>

        {viewMode === 'mark' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568'
              }}>
                Quick Actions:
              </span>
              <button
                onClick={() => handleMarkAll('present')}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckSquare size={14} style={{ marginRight: '4px' }} />
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
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
                <XSquare size={14} style={{ marginRight: '4px' }} />
                Mark All Absent
              </button>
            </div>
            
            {/* Save Button - Always visible in marking mode */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '16px 0',
              borderTop: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedClass || !selectedSubject || !selectedDate || attendanceRecords.length === 0}
                style={{
                  padding: '16px 32px',
                  background: submitting || !selectedClass || !selectedSubject || !selectedDate || attendanceRecords.length === 0
                    ? 'rgba(156, 163, 175, 0.5)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: submitting || !selectedClass || !selectedSubject || !selectedDate || attendanceRecords.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: submitting || !selectedClass || !selectedSubject || !selectedDate || attendanceRecords.length === 0
                    ? 'none'
                    : '0 8px 24px rgba(102, 126, 234, 0.3)',
                  minWidth: '200px',
                  justifyContent: 'center'
                }}
              >
                {submitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Saving Attendance...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Save Attendance
                  </>
                )}
              </button>
              
              {!selectedClass || !selectedSubject || !selectedDate || attendanceRecords.length === 0 ? (
                <div style={{
                  marginLeft: '16px',
                  fontSize: '14px',
                  color: '#ef4444',
                  fontWeight: '500'
                }}>
                  {!selectedClass && 'Please select a class'}
                  {!selectedSubject && selectedClass && ' Please select a subject'}
                  {!selectedDate && selectedClass && selectedSubject && ' Please select a date'}
                  {attendanceRecords.length === 0 && selectedClass && selectedSubject && selectedDate && ' No students found'}
                </div>
              ) : null}
            </div>
          </div>
        )}
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

      {loadingError && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} style={{ color: '#f59e0b' }} />
          <span style={{
            color: '#92400e',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {loadingError}
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

      {/* Main Content */}
      {viewMode === 'mark' ? (
        /* Attendance Marking View */
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
              Students ({attendanceRecords.length})
            </h3>
            <div style={{
              fontSize: '14px',
              color: '#667eea',
              fontWeight: '600'
            }}>
              {selectedDate}
            </div>
          </div>
          
          {attendanceRecords.length > 0 ? (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {attendanceRecords.map((record, index) => (
                <div
                  key={record.studentId}
                  style={{
                    padding: '16px 24px',
                    borderBottom: index < attendanceRecords.length - 1 ? '1px solid rgba(102, 126, 234, 0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    minWidth: '200px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    {record.studentName}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flex: 1
                  }}>
                    {['present', 'absent', 'late', 'excused'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(record.studentId, status)}
                        style={{
                          padding: '8px 16px',
                          background: record.status === status 
                            ? getStatusColor(status) 
                            : 'rgba(102, 126, 234, 0.1)',
                          color: record.status === status ? 'white' : getStatusColor(status),
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  {record.status === 'late' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Timer size={16} style={{ color: '#f59e0b' }} />
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={record.lateMinutes}
                        onChange={(e) => handleLateMinutesChange(record.studentId, e.target.value)}
                        placeholder="Min"
                        style={{
                          width: '60px',
                          padding: '4px 8px',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#1a202c'
                        }}
                      />
                    </div>
                  )}
                  
                  <input
                    type="text"
                    placeholder="Notes..."
                    value={record.notes}
                    onChange={(e) => handleNotesChange(record.studentId, e.target.value)}
                    style={{
                      flex: 1,
                      maxWidth: '200px',
                      padding: '8px 12px',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#1a202c'
                    }}
                  />
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
                {selectedClass ? 'No students are assigned to this class.' : 'Please select a class to mark attendance.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Attendance Reports View */
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 24px'
          }}>
            Attendance Reports
          </h3>
          
          {/* Student Filter */}
          {selectedClass && reportStudents.length > 0 && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px'
              }}>
                Filter by Student (Optional)
              </label>
              <select
                value={selectedReportStudent}
                onChange={(e) => setSelectedReportStudent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: '500',
                  color: '#1a202c'
                }}
              >
                <option value="">All Students - Class Statistics</option>
                {reportStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Individual Student Report */}
          {selectedReportStudent && (
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(99, 102, 241, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a202c',
                margin: '0 0 16px'
              }}>
                Individual Student Report
              </h4>
              
              {reportLoading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid rgba(99, 102, 241, 0.2)',
                    borderTop: '3px solid #6366f1',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px'
                  }}></div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6366f1',
                    fontWeight: '500'
                  }}>
                    Loading student data...
                  </div>
                </div>
              ) : studentAttendanceData.length > 0 ? (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#10b981',
                        margin: '0 0 4px'
                      }}>
                        {studentAttendanceData.filter(a => a.status === 'present').length}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#065f46',
                        fontWeight: '500'
                      }}>
                        Present
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#ef4444',
                        margin: '0 0 4px'
                      }}>
                        {studentAttendanceData.filter(a => a.status === 'absent').length}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#991b1b',
                        fontWeight: '500'
                      }}>
                        Absent
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#f59e0b',
                        margin: '0 0 4px'
                      }}>
                        {studentAttendanceData.filter(a => a.status === 'late').length}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#92400e',
                        fontWeight: '500'
                      }}>
                        Late
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#6366f1',
                        margin: '0 0 4px'
                      }}>
                        {Math.round(((studentAttendanceData.filter(a => a.status === 'present' || a.status === 'late').length / studentAttendanceData.length) * 100) * 100) / 100}%
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#4338ca',
                        fontWeight: '500'
                      }}>
                        Attendance Rate
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: '8px'
                  }}>
                    {studentAttendanceData.map((attendance, index) => (
                      <div
                        key={attendance.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: index < studentAttendanceData.length - 1 ? '1px solid rgba(102, 126, 234, 0.05)' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1a202c'
                          }}>
                            {attendance.date}
                          </div>
                          {attendance.subject && (
                            <div style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              background: 'rgba(107, 114, 128, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              {attendance.subject.name}
                            </div>
                          )}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            background: getStatusColor(attendance.status),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                          </span>
                          {attendance.notes && (
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontStyle: 'italic'
                            }}>
                              {attendance.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#718096',
                    margin: 0
                  }}>
                    No attendance records found for this student.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Class Statistics */}
          {!selectedReportStudent && (
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a202c',
                margin: '0 0 16px'
              }}>
                Class Statistics
              </h4>
              
              {attendanceStats ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#10b981',
                      margin: '0 0 8px'
                    }}>
                      {attendanceStats.presentCount}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#065f46',
                      fontWeight: '500'
                    }}>
                      Present
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#ef4444',
                      margin: '0 0 8px'
                    }}>
                      {attendanceStats.absentCount}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#991b1b',
                      fontWeight: '500'
                    }}>
                      Absent
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#f59e0b',
                      margin: '0 0 8px'
                    }}>
                      {attendanceStats.lateCount}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#92400e',
                      fontWeight: '500'
                    }}>
                      Late
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#6366f1',
                      margin: '0 0 8px'
                    }}>
                      {attendanceStats.attendanceRate}%
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#4338ca',
                      fontWeight: '500'
                    }}>
                      Attendance Rate
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '32px'
                }}>
                  <p style={{
                    fontSize: '16px',
                    color: '#718096',
                    margin: 0
                  }}>
                    Select a class to view attendance statistics.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AttendanceManagement;
