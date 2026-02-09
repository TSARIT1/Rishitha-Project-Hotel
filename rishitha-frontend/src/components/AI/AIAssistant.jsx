import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2, Sparkles, User, Bot, Loader2, Trash2, Plus, History, ChevronLeft } from 'lucide-react';
import api from '../../services/api';
// import './AIAssistant.css';

const AIAssistant = ({ contextData = {}, contextName = "General" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState('chat'); // 'chat' or 'history'
  
  // Load full history from LocalStorage
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('aiChatSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize or load session on open
  useEffect(() => {
    if (isOpen && !currentSessionId) {
       if (chatSessions.length > 0) {
           // Load most recent
           loadSession(chatSessions[0].id);
       } else {
           startNewChat();
       }
    }
  }, [isOpen]);

  // Save sessions whenever they change
  useEffect(() => {
    localStorage.setItem('aiChatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (view === 'chat') {
        scrollToBottom();
    }
  }, [messages, view, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewChat = () => {
    const newId = Date.now().toString();
    const initialMsg = { role: 'ai', content: `Hello! I'm your AI Restaurant Consultant. I have access to your **${contextName}** data. Ask me anything!` };
    
    const newSession = {
        id: newId,
        date: newId, // timestamp
        title: 'New Conversation',
        messages: [initialMsg]
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([initialMsg]);
    setView('chat');
  };

  const loadSession = (id) => {
      const session = chatSessions.find(s => s.id === id);
      if (session) {
          setCurrentSessionId(session.id);
          setMessages(session.messages);
          setView('chat');
      }
  };

  const deleteSession = (e, id) => {
      e.stopPropagation();
      const updatedSessions = chatSessions.filter(s => s.id !== id);
      setChatSessions(updatedSessions);
      
      if (currentSessionId === id) {
          if (updatedSessions.length > 0) {
              loadSession(updatedSessions[0].id);
          } else {
              startNewChat();
          }
      }
  };

  const updateCurrentSession = (newMessages) => {
      setMessages(newMessages);
      setChatSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
              // Update title if it's the first user message
              let title = session.title;
              if (session.messages.length <= 1 && newMessages.length > 1) {
                  const firstUserMsg = newMessages.find(m => m.role === 'user');
                  if (firstUserMsg) {
                      title = firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
                  }
              }
              return { ...session, messages: newMessages, title };
          }
          return session;
      }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const updatedMessages = [...messages, { role: 'user', content: userMsg }];
    
    updateCurrentSession(updatedMessages); // Optimistic update
    setInput('');
    setLoading(true);

    try {
        const response = await api.post('/reports/chat', {
            message: userMsg,
            context: contextData
        });

        const aiMsg = response.data.success 
            ? { role: 'ai', content: response.data.data }
            : { role: 'ai', content: "I encountered an error analyzing the data." };
        
        updateCurrentSession([...updatedMessages, aiMsg]);
        
    } catch (error) {
        console.error("AI Chat Error:", error);
        updateCurrentSession([...updatedMessages, { role: 'ai', content: "Sorry, I can't reach the server right now." }]);
    } finally {
        setLoading(false);
    }
  };

  // Render Markdown-ish text safely
  const renderMessageToCheck = (text) => {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (!isOpen) {
    return (
      <button 
        className="position-fixed bottom-0 end-0 m-4 btn btn-primary rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center z-3 animate-bounce-in"
        style={{ width: '60px', height: '60px', zIndex: 1050 }}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div 
      className={`position-fixed bottom-0 end-0 m-3 card border-0 shadow-lg z-3 overflow-hidden d-flex flex-column transition-all`}
      style={{ 
        width: isMinimized ? '300px' : '380px', 
        height: isMinimized ? '60px' : '550px',
        maxWidth: 'calc(100vw - 32px)',
        zIndex: 1050,
        borderRadius: '20px'
      }}
    >
      {/* Header */}
      <div className="card-header bg-primary text-white border-0 py-3 d-flex justify-content-between align-items-center cursor-pointer"
           onClick={() => !isMinimized && setIsMinimized(true)}>
        <div className="d-flex align-items-center gap-2">
            {view === 'history' && (
                <button className="btn btn-sm btn-link text-white p-0 me-1" onClick={(e) => { e.stopPropagation(); setView('chat'); }}>
                    <ChevronLeft size={20} />
                </button>
            )}
            <div className="bg-white bg-opacity-25 p-1 rounded-circle">
                <Bot size={20} />
            </div>
            <div className="overflow-hidden">
                <h6 className="mb-0 fw-bold text-truncate">{view === 'history' ? 'Chat History' : 'AI Assistant'}</h6>
                {!isMinimized && view === 'chat' && <small className="text-white-50 d-block text-truncate" style={{fontSize: '10px', maxWidth: '150px'}}>Connected to {contextName}</small>}
            </div>
        </div>
        <div className="d-flex gap-2">
            {!isMinimized && view === 'chat' && (
                <>
                    <button className="btn btn-sm btn-link text-white p-0" onClick={(e) => { e.stopPropagation(); setView('history'); }} title="History">
                        <History size={18} />
                    </button>
                    <button className="btn btn-sm btn-link text-white p-0" onClick={(e) => { e.stopPropagation(); startNewChat(); }} title="New Chat">
                        <Plus size={20} />
                    </button>
                </>
            )}
            {isMinimized ? (
                <button className="btn btn-sm btn-link text-white p-0" onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>
                    <Maximize2 size={18} />
                </button>
            ) : (
                <button className="btn btn-sm btn-link text-white p-0" onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}>
                    <Minimize2 size={18} />
                </button>
            )}
            <button className="btn btn-sm btn-link text-white p-0" onClick={() => setIsOpen(false)}>
                <X size={20} />
            </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
          <>
            {view === 'chat' ? (
                /* Chat View */
                <div className="card-body p-3 overflow-auto bg-light custom-thin-scrollbar flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0 me-2 mt-1">
                                    <div className="bg-primary text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                                        <Bot size={14} />
                                    </div>
                                </div>
                            )}
                            <div 
                                className={`p-3 rounded-4 shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-tr-0' 
                                    : 'bg-white text-dark border rounded-tl-0'
                                }`}
                                style={{ maxWidth: '85%' }}
                            >
                                {msg.role === 'ai' ? renderMessageToCheck(msg.content) : msg.content}
                            </div>
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0 ms-2 mt-1">
                                    <div className="bg-dark text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                                        <User size={14} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex mb-3 justify-content-start animate-pulse">
                            <div className="flex-shrink-0 me-2 mt-1">
                                <div className="bg-primary text-white rounded-circle p-1" style={{width: '24px', height: '24px'}}><Bot size={14} /></div>
                            </div>
                            <div className="bg-white text-dark border p-3 rounded-4 rounded-tl-0 shadow-sm">
                                <div className="d-flex gap-1">
                                    <span className="spinner-grow spinner-grow-sm text-primary" role="status" style={{width: '6px', height: '6px'}}></span>
                                    <span className="spinner-grow spinner-grow-sm text-primary" role="status" style={{width: '6px', height: '6px', animationDelay: '0.2s'}}></span>
                                    <span className="spinner-grow spinner-grow-sm text-primary" role="status" style={{width: '6px', height: '6px', animationDelay: '0.4s'}}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                /* History View */
                <div className="card-body p-0 overflow-auto bg-white custom-thin-scrollbar flex-grow-1">
                    {chatSessions.length === 0 ? (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-4 text-center">
                            <History size={40} className="mb-2 opacity-50" />
                            <p>No chat history yet.</p>
                            <button className="btn btn-primary btn-sm rounded-pill mt-2" onClick={startNewChat}>Start New Chat</button>
                        </div>
                    ) : (
                        <div className="list-group list-group-flush">
                            {chatSessions.map((session) => (
                                <div 
                                    key={session.id} 
                                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 px-4 ${currentSessionId === session.id ? 'bg-primary-soft' : ''}`}
                                    onClick={() => loadSession(session.id)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <div className="d-flex align-items-center gap-3 overflow-hidden">
                                        <div className={`p-2 rounded-circle ${currentSessionId === session.id ? 'bg-primary text-white' : 'bg-light text-muted'}`}>
                                            <MessageSquare size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h6 className="mb-0 text-truncate fw-semibold" style={{maxWidth: '200px'}}>{session.title}</h6>
                                            <small className="text-muted">{new Date(parseInt(session.date)).toLocaleDateString()} • {new Date(parseInt(session.date)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-link text-danger p-1 hover-scale" 
                                        onClick={(e) => deleteSession(e, session.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Input - Only Show in Chat View */}
            {view === 'chat' && (
                <div className="card-footer bg-white p-3 border-top-0">
                    <form onSubmit={handleSend} className="d-flex gap-2">
                        <input 
                            type="text" 
                            className="form-control rounded-pill bg-light border-0 px-3"
                            placeholder="Ask about your data..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 flex-shrink-0"
                            style={{width: '40px', height: '40px', minWidth: '40px'}}
                            disabled={loading || !input.trim()}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <Send size={18} color="#ffffff" />}
                        </button>
                    </form>
                </div>
            )}
          </>
      )}
    </div>
  );
};

export default AIAssistant;
