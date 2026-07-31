import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, Search, MoreVertical, Plus, Bot } from 'lucide-react';

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  // Fetch conversations on load
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat/conversations', {
        withCredentials: true
      });
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/chat/conversations', 
        { title: 'New Chat' },
        { withCredentials: true }
      );
      fetchConversations();
      setSelectedConversation(response.data.chat);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/conversations/${conversationId}/messages`, {
        withCredentials: true
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation) {
      const userMessage = message;
      setMessage('');
      
      // Add user message to UI immediately
      setMessages([...messages, { role: 'user', content: userMessage, timestamp: new Date() }]);
      setAiTyping(true);

      try {
        const response = await axios.post('http://localhost:8000/api/chat/message', 
          {
            conversationId: selectedConversation._id,
            message: userMessage
          },
          { withCredentials: true }
        );
        
        // Update messages with AI response
        setMessages(response.data.chat.messages);
      } catch (error) {
        console.error('Failed to send message:', error);
        setMessages([...messages, { role: 'user', content: userMessage, timestamp: new Date() }]);
      } finally {
        setAiTyping(false);
      }
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">AI Career Assistant</h1>
              <Button onClick={createNewConversation} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Start a new chat with AI assistant</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?._id === conv._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Bot className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">{conv.title}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.messages?.[conv.messages.length - 1]?.content?.substring(0, 50) || 'No messages'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Bot className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.title}</h2>
                    <p className="text-sm text-gray-500">AI Career Assistant</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="p-12 text-center">
                <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Start a Conversation</h3>
                <p className="text-gray-400 mt-2">Click "New Chat" to talk with AI Career Assistant</p>
                <Button onClick={createNewConversation} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
