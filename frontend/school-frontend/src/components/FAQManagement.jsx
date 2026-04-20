import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, HelpCircle, MessageSquare, ChevronDown, ChevronUp, X, Save, AlertCircle } from 'lucide-react';
import './FAQ.css';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    order: 0
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'academic', label: 'Academic' },
    { value: 'admissions', label: 'Admissions' },
    { value: 'technical', label: 'Technical' },
    { value: 'policies', label: 'Policies' }
  ];

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const mockData = [
        {
          id: 1,
          question: 'What are the admission requirements?',
          answer: 'Students must provide previous academic records, birth certificate, and complete the application form with required documentation.',
          category: 'admissions',
          order: 1,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          question: 'How can I access my grades online?',
          answer: 'Students can access their grades through the student portal using their assigned credentials. Grades are updated weekly.',
          category: 'academic',
          order: 2,
          createdAt: '2024-01-16'
        },
        {
          id: 3,
          question: 'What is the school calendar for 2024-2025?',
          answer: 'The academic year runs from August 2024 to May 2025, with holidays and breaks listed in the academic calendar.',
          category: 'general',
          order: 3,
          createdAt: '2024-01-17'
        }
      ];
      setFaqs(mockData);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question || formData.question.trim() === '') {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer || formData.answer.trim() === '') {
      newErrors.answer = 'Answer is required';
    }
    
    if (formData.answer && formData.answer.length < 10) {
      newErrors.answer = 'Answer must be at least 10 characters long';
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
      
      if (editingFaq) {
          console.log('Updating FAQ:', editingFaq.id, formData);
      } else {
          console.log('Creating FAQ:', formData);
      }
      
      await loadFAQs();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order
    });
    setShowForm(true);
  };

  const handleDelete = async (faq) => {
    if (window.confirm(`Are you sure you want to delete this FAQ?`)) {
      try {
          console.log('Deleting FAQ:', faq.id);
        await loadFAQs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        alert('Failed to delete FAQ. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      order: 0
    });
    setErrors({});
    setEditingFaq(null);
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    const colors = {
      general: '#2563eb',
      academic: '#7c3aed',
      admissions: '#10b981',
      technical: '#f59e0b',
      policies: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading) {
    return (
      <div className="faq-loading">
        <div className="loading-spinner"></div>
        <p>Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="faq-management">
      <header className="faq-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <HelpCircle size={32} />
            </div>
            <div className="header-text">
              <h1>FAQ Management</h1>
              <p>Manage frequently asked questions and help content</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn-primary btn-enhanced"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus size={20} />
              <span>Add FAQ</span>
            </button>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <MessageSquare size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{faqs.length}</div>
              <div className="stat-label">Total FAQs</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <HelpCircle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Search size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{filteredFaqs.length}</div>
              <div className="stat-label">Filtered</div>
            </div>
          </div>
        </div>
      </header>

      <section className="controls-bar">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      <section className="content-section">
        {filteredFaqs.length > 0 ? (
          <div className="faq-grid">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="faq-card">
                <div className="card-header">
                  <div className="card-meta">
                    <div 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(faq.category) }}
                    >
                      {getCategoryLabel(faq.category)}
                    </div>
                    <div className="faq-order">#{faq.order}</div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(faq)}
                      title="Edit FAQ"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(faq)}
                      title="Delete FAQ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="faq-question">
                    <h3>{faq.question}</h3>
                    <button 
                      className="expand-toggle"
                      onClick={() => toggleExpanded(faq.id)}
                    >
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                  
                  <div className={`faq-answer ${expandedItems.has(faq.id) ? 'expanded' : 'collapsed'}`}>
                    <div className="answer-content">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-enhanced">
            <div className="empty-content">
              <div className="empty-icon">
                <HelpCircle size={64} />
              </div>
              <div className="empty-text">
                <h3>No FAQs Found</h3>
                <p>
                  {searchTerm 
                    ? 'No FAQs match your search criteria.'
                    : 'Get started by creating your first FAQ.'}
                </p>
                {!searchTerm && (
                  <button 
                    className="btn-primary btn-large"
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                  >
                    <Plus size={20} />
                    <span>Create First FAQ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-enhanced">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button 
                className="btn-close"
                onClick={() => setShowForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Question <span className="required">*</span>
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className={`form-textarea ${errors.question ? 'form-input-error' : ''}`}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                  {errors.question && <span className="error-message">{errors.question}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Answer <span className="required">*</span>
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                    className={`form-textarea ${errors.answer ? 'form-input-error' : ''}`}
                    placeholder="Provide a detailed answer..."
                    rows={6}
                  />
                  {errors.answer && <span className="error-message">{errors.answer}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Category
                    </label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="form-select"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      className="form-input"
                      min="0"
                      placeholder="Display order"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>{editingFaq ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>{editingFaq ? 'Update FAQ' : 'Create FAQ'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
