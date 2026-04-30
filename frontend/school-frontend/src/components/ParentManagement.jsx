import React, { useEffect, useMemo, useState } from 'react';
import { Users, UserPlus, Mail, Link2, Check, X, AlertCircle } from 'lucide-react';
import { adminAPI } from '../services/adminService';
import { studentAPI } from '../services/teacherStudentService';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

const ParentManagement = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [assignmentParent, setAssignmentParent] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [parentData, studentData] = await Promise.all([
        adminAPI.getParents(),
        studentAPI.getAllStudents()
      ]);

      const normalizedParents = (parentData || []).map((parent) => ({
        id: parent.id,
        firstName: parent.first_name || parent.firstName,
        lastName: parent.last_name || parent.lastName,
        email: parent.email,
        students: (parent.students || []).map((student) => ({
          id: student.id,
          firstName: student.first_name || student.firstName,
          lastName: student.last_name || student.lastName,
          email: student.email
        }))
      }));

      const normalizedStudents = (studentData || []).map((student) => ({
        id: student.id,
        firstName: student.firstName || student.first_name,
        lastName: student.lastName || student.last_name,
        email: student.email
      }));

      const uniqueStudentsMap = new Map();
      normalizedStudents.forEach((student) => {
        const key = student.id ?? `${student.firstName}-${student.lastName}-${student.email}`;
        if (!uniqueStudentsMap.has(key)) {
          uniqueStudentsMap.set(key, student);
        }
      });

      setParents(normalizedParents);
      setStudents(Array.from(uniqueStudentsMap.values()));
      setError(null);
    } catch (err) {
      setError('Parents service is unavailable. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Invalid email';
    if (!formData.password.trim() || formData.password.length < 6) nextErrors.password = 'Min 6 characters';

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateParent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      await adminAPI.createUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'Parent'
      });
      setShowCreateModal(false);
      setFormData(initialForm);
      await loadData();
    } catch (err) {
      console.error('Failed to create parent', err);
      setFormErrors({ api: err?.error || 'Failed to create parent.' });
    } finally {
      setSubmitting(false);
    }
  };

  const allStudentsMap = useMemo(() => {
    const map = new Map();
    students.forEach((student) => map.set(student.id, student));
    return map;
  }, [students]);

  const openAssignmentModal = (parent) => {
    setAssignmentParent(parent);
    setSelectedStudentIds(parent.students?.map((s) => s.id) || []);
    setAssignmentError('');
    setShowAssignModal(true);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignStudents = async (e) => {
    e.preventDefault();
    if (!assignmentParent) return;
    try {
      setAssigning(true);
      await adminAPI.assignParentStudents(assignmentParent.id, selectedStudentIds);
      setShowAssignModal(false);
      setAssignmentParent(null);
      setAssignmentError('');
      await loadData();
    } catch (err) {
      console.error('Failed to assign students', err);
      const message = err?.error || 'Failed to assign students.';
      setAssignmentError(message);
    } finally {
      setAssigning(false);
    }
  };

  const filteredParents = parents.filter((parent) => {
    const query = searchTerm.toLowerCase();
    return (
      parent.firstName?.toLowerCase().includes(query) ||
      parent.lastName?.toLowerCase().includes(query) ||
      parent.email?.toLowerCase().includes(query)
    );
  });

  const totalAssigned = parents.reduce((sum, parent) => sum + (parent.students?.length || 0), 0);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading parent data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#1a202c',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Users size={26} />
          </div>
          Parent Management
        </h1>
        <p style={{ fontSize: '16px', color: '#718096', margin: 0 }}>
          Create parent accounts and assign students to their guardians.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="stat-card">
          <div className="stat-card__value">{parents.length}</div>
          <div className="stat-card__label">Total Parents</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{totalAssigned}</div>
          <div className="stat-card__label">Students Linked</div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          position: 'relative',
          flex: 1,
          minWidth: '240px'
        }}>
          <input
            type="text"
            placeholder="Search parents by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              color: '#1a202c'
            }}
          />
        </div>
        <button
          onClick={() => {
            setFormData(initialForm);
            setFormErrors({});
            setShowCreateModal(true);
          }}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <UserPlus size={18} />
          Add Parent
        </button>
      </div>

      {filteredParents.length === 0 ? (
        <div className="empty-state">
          {error ? <p>{error}</p> : <p>No parents match your search. Add one to get started.</p>}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {filteredParents.map((parent, parentIndex) => (
            <div
              key={`parent-${parent.id ?? 'unknown'}-${parentIndex}`}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                border: '1px solid rgba(226,232,240,0.8)',
                padding: '20px',
                boxShadow: '0 8px 30px rgba(15,23,42,0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>
                  {parent.firstName} {parent.lastName}
                </h3>
                <button
                  onClick={() => openAssignmentModal(parent)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600
                  }}
                >
                  <Link2 size={16} /> Assign
                </button>
              </div>
              <div style={{ color: '#4b5563', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> {parent.email}
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong style={{ fontSize: '13px', color: '#718096' }}>Students</strong>
                {parent.students?.length ? (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', color: '#1f2937', fontSize: '14px' }}>
                    {parent.students.map((student, studentIndex) => (
                      <li key={`student-${student.id ?? 'unknown'}-${parent.id ?? 'parent'}-${studentIndex}`}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: '6px 0 0 0', color: '#a0aec0' }}>No students assigned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Create Parent Account</h3>
              <button className="modal__close" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form className="modal__body" onSubmit={handleCreateParent}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`form-group__input ${formErrors.firstName ? 'form-group__input--error' : ''}`}
                    placeholder="e.g. Sarah"
                  />
                  {formErrors.firstName && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {formErrors.firstName}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-group__label">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`form-group__input ${formErrors.lastName ? 'form-group__input--error' : ''}`}
                    placeholder="e.g. Adeyemi"
                  />
                  {formErrors.lastName && (
                    <span className="form-group__error">
                      <AlertCircle size={14} />
                      {formErrors.lastName}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-group__label">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`form-group__input ${formErrors.email ? 'form-group__input--error' : ''}`}
                  placeholder="parent@example.com"
                />
                {formErrors.email && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-group__label">Temporary Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`form-group__input ${formErrors.password ? 'form-group__input--error' : ''}`}
                  placeholder="Min 6 characters"
                />
                {formErrors.password && (
                  <span className="form-group__error">
                    <AlertCircle size={14} />
                    {formErrors.password}
                  </span>
                )}
              </div>
              <p className="form-hint">
                Parents can update their profile after the first login. Use a temporary password you can share securely.
              </p>
              {formErrors.api && <div className="error">{formErrors.api}</div>}
              <div className="modal__actions">
                <button type="button" className="btn btn--secondary" onClick={() => setShowCreateModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Create Parent
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && assignmentParent && (
        <div className="modal-overlay" onClick={() => {
          setShowAssignModal(false);
          setAssignmentParent(null);
          setAssignmentError('');
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <p className="modal__eyebrow">Assign Students</p>
                <h2 className="modal__title">
                  {assignmentParent.firstName} {assignmentParent.lastName}
                </h2>
                <p className="modal__subtitle">Select the students that belong to this parent. Each student can have up to two parents.</p>
              </div>
              <button className="btn-icon btn-icon--close" onClick={() => {
                setShowAssignModal(false);
                setAssignmentParent(null);
                setAssignmentError('');
              }}>
                <X size={18} />
              </button>
            </div>
            <form className="modal__body" onSubmit={handleAssignStudents}>
              {assignmentError && (
                <div
                  style={{
                    marginBottom: '16px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.05))',
                    border: '1px solid rgba(239,68,68,0.3)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    color: '#991b1b'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Assignment blocked</strong>
                    <span style={{ fontSize: '13px', lineHeight: 1.5 }}>{assignmentError}</span>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-group__label">Select Students</label>
                <div className="assignment-list" style={{ maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '12px' }}>
                  {students.length === 0 ? (
                    <p style={{ color: '#94a3b8', margin: 0 }}>No students available.</p>
                  ) : (
                    students.map((student, studentIndex) => (
                      <label key={`student-${student.id ?? 'unknown'}-${parent.id ?? 'parent'}-${studentIndex}`} className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                        <span>
                          {student.firstName} {student.lastName}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn--secondary" onClick={() => {
                  setShowAssignModal(false);
                  setAssignmentParent(null);
                  setAssignmentError('');
                }} disabled={assigning}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={assigning}>
                  {assigning ? 'Saving...' : 'Save Assignments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentManagement;
