import React from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  Layers,
  Users,
  User,
  BookOpen,
  ClipboardList,
  FileText,
  CreditCard
} from 'lucide-react'

const adminItems = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin-academic-years', label: 'Academic Years', icon: CalendarDays },
  { id: 'admin-classes', label: 'Classes', icon: Layers },
  { id: 'admin-sections', label: 'Sections', icon: Users },
  { id: 'admin-students', label: 'Students', icon: User },
  { id: 'admin-teachers', label: 'Teachers', icon: BookOpen },
  { id: 'admin-subjects', label: 'Subjects', icon: ClipboardList },
  { id: 'admin-parents', label: 'Parents', icon: Users },
  { id: 'admin-student-assignment', label: 'Assignments', icon: FileText },
  { id: 'admin-payments', label: 'Payments', icon: CreditCard }
]

const AdminPanel = ({ navigate, currentPage }) => {
  return (
    <div className="panel-content">
      <div className="panel-top">
        <div>
          <p className="panel-subtitle">Admin control center</p>
          <h2 className="panel-title">School administration</h2>
          <p className="panel-copy">Choose a section to manage school data, users, and payments.</p>
        </div>
      </div>

      <div className="admin-navigation">
        {adminItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-btn ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <Icon size={18} style={{ marginRight: 8 }} />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AdminPanel
