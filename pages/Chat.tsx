
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Message } from '../types';
import { Send, User, MessageCircle } from 'lucide-react';

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: Message;
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      const allMsgs = await api.getMessages(user.id);
      setMessages(allMsgs);
      
      // Group by user
      const convMap = new Map<string, Conversation>();
      
      allMsgs.forEach(m => {
        const isSender = m.senderId === user.id;
        const otherId = isSender ? m.receiverId : m.senderId;
        const otherName = isSender ? m.receiverName : m.senderName;
        
        const existing = convMap.get(otherId);
        if (!existing || new Date(m.timestamp) > new Date(existing.lastMessage.timestamp)) {
          convMap.set(otherId, {
            otherUserId: otherId,
            otherUserName: otherName,
            lastMessage: m
          });
        }
      });
      
      setConversations(Array.from(convMap.values()).sort((a, b) => 
        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
      ));

      // Handle URL param for auto-selection
      if (targetUserId && targetUserId !== user.id) {
        if (!convMap.has(targetUserId)) {
          // Fetch user info if strictly needed, or just allow starting a fresh chat
          // For simplicity in mock, we assume we can just start chatting.
          // We might need to fetch the name if we want to display it nicely in the list before a message is sent
          // But for now, let's just select it.
          setSelectedUserId(targetUserId);
        } else {
          setSelectedUserId(targetUserId);
        }
      } else if (!selectedUserId && convMap.size > 0 && !targetUserId) {
        // Default to first conversation
        setSelectedUserId(Array.from(convMap.keys())[0]);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [user, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUserId) return;

    try {
      await api.sendMessage(user, selectedUserId, newMessage);
      setNewMessage('');
      // Optimistic update or wait for poll
      const allMsgs = await api.getMessages(user.id);
      setMessages(allMsgs);
    } catch (err) {
      console.error(err);
    }
  };

  const getSelectedUserMessages = () => {
    if (!selectedUserId) return [];
    return messages.filter(m => 
      (m.senderId === user?.id && m.receiverId === selectedUserId) ||
      (m.senderId === selectedUserId && m.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getSelectedUserName = () => {
    if (!selectedUserId) return '';
    const conv = conversations.find(c => c.otherUserId === selectedUserId);
    if (conv) return conv.otherUserName;
    
    // Fallback if starting new chat (fetching name would require another API call in a real app)
    // For this mock, we can try to find it in the messages if exists, otherwise "User"
    return "User";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 gap-4 flex overflow-hidden">
        
        {/* Sidebar: Conversations */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
             <h2 className="font-bold text-lg text-gray-800">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm">No conversations yet.</div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.otherUserId}
                  onClick={() => setSelectedUserId(conv.otherUserId)}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedUserId === conv.otherUserId ? 'bg-blue-50 border-l-4 border-l-primary' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0">
                    {conv.otherUserName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.otherUserName}</h3>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main: Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          {selectedUserId ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex items-center">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                    <User className="w-4 h-4"/>
                 </div>
                 <span className="font-bold text-gray-800">{getSelectedUserName()}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {getSelectedUserMessages().map(m => {
                  const isMe = m.senderId === user?.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  <button type="submit" className="bg-primary hover:bg-blue-800 text-white p-3 rounded-xl transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle className="w-16 h-16 mb-4 text-gray-200" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
