import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import messagingService from '../../services/messagingService';

const StudentChat = ({ user, student }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const room = 'student-general-chat';

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Connect to Socket.IO
    const socketConnection = io(import.meta.env.VITE_REALTIME_API_URL || 'http://localhost:5005');
    setSocket(socketConnection);

    // Join room
    socketConnection.emit('joinRoom', room);

    // Listen for new messages
    socketConnection.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for errors
    socketConnection.on('messageError', (error) => {
      setError(error.error);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await messagingService.getMessages(room);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    try {
      setLoading(true);
      setError('');

      const messageData = {
        room,
        senderEmail: user?.email,
        senderName: student?.firstName + ' ' + student?.lastName,
        senderRole: 'student',
        text: newMessage.trim()
      };

      // Send via Socket.IO
      socket.emit('sendMessage', messageData);

      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <MessageCircle size={20} />
          Student Chat
        </h3>
        <p style={{
          margin: '4px 0 0',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Connect with teachers and administrators
        </p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: '#f8fafc'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            padding: '40px 20px'
          }}>
            <MessageCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((message) => (
              <div key={message._id || message.id} style={{
                display: 'flex',
                justifyContent: message.senderEmail === user?.email ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  background: message.senderEmail === user?.email ? '#3b82f6' : '#ffffff',
                  color: message.senderEmail === user?.email ? '#ffffff' : '#111827',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: message.senderEmail === user?.email ? 'none' : '1px solid #e5e7eb'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '4px',
                    opacity: 0.8
                  }}>
                    {message.senderName}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {message.text}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.6,
                    marginTop: '4px',
                    textAlign: 'right'
                  }}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        background: '#ffffff'
      }}>
        {error && (
          <div style={{
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '8px'
          }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            style={{
              padding: '12px 16px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !newMessage.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentChat;