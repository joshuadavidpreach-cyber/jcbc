
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, ChatMessage, SiteConfig, AffiliateLink } from '../types';
import { Send, LogOut, Trash2, MessageCircle, ShieldCheck, Tag, ExternalLink } from 'lucide-react';

interface Props {
  user: User | null;
  config: SiteConfig;
  onUpdateUser: (user: User) => void;
}

const CommunityChat: React.FC<Props> = ({ user, config, onUpdateUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateLink[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([]);
      }
    }
    setAffiliates(JSON.parse(localStorage.getItem('jcbc_affiliate_links') || '[]'));
  }, []);

  useEffect(() => {
    if (scrollRef.current && user?.isOptedInChat) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, user?.isOptedInChat]);

  const handleOptIn = () => user && onUpdateUser({ ...user, isOptedInChat: true });
  const handleOptOut = () => user && onUpdateUser({ ...user, isOptedInChat: false });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const msg: ChatMessage = { 
      id: Date.now().toString(), 
      userId: user.id, 
      userName: user.name, 
      userRole: user.role, 
      text: trimmedInput, 
      timestamp: Date.now() 
    };

    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem('jcbc_chat', JSON.stringify(updated));
    setInput('');
  };

  const handleClearChat = () => {
    if (!user) return;
    const isPrivileged = ['admin', 'pastor'].includes(user.role);
    if (isPrivileged) {
      if (confirm('WARNING: Permanent purge of chat archive. Proceed?')) { 
        setMessages([]); 
        localStorage.removeItem('jcbc_chat'); 
      }
    }
  };

  if (!user || !user.isOptedInChat) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-900 mx-auto shadow-inner border border-blue-50">
          <MessageCircle className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">{config.communityTitle}</h2>
          <p className="text-slate-600 font-medium text-lg leading-relaxed italic">"{config.communitySubtitle}"</p>
        </div>
        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 text-left shadow-lg space-y-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck className="w-16 h-16" /></div>
           <div className="flex items-center space-x-2 text-blue-900 relative z-10">
             <ShieldCheck className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Remnant Conduct Code</span>
           </div>
           <p className="text-sm text-slate-500 font-medium italic leading-relaxed relative z-10">"{config.chatRules}"</p>
        </div>
        {!user ? (
           <Link to="/login" className="inline-block bg-blue-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-800 transition-all shadow-xl active:scale-95 border-b-4 border-blue-950">
             Login to Join
           </Link>
        ) : (
           <button 
             onClick={handleOptIn} 
             className="bg-blue-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-800 transition-all shadow-xl active:scale-95 border-b-4 border-blue-950"
           >
             {config.chatJoinButtonText}
           </button>
        )}

        {config.communityCustomHtml && (
          <div className="pt-20 border-t border-slate-100 text-left" dangerouslySetInnerHTML={{ __html: config.communityCustomHtml }} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
          <h2 className="font-black text-blue-900 uppercase italic tracking-tighter text-2xl">{config.communityTitle}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {['admin', 'pastor'].includes(user.role) && (
            <button onClick={handleClearChat} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"><Trash2 className="w-5 h-5" /></button>
          )}
          <button onClick={handleOptOut} className="flex items-center space-x-2 px-6 py-2 text-slate-400 hover:text-blue-900 font-black uppercase tracking-[0.2em] text-[10px]"><LogOut className="w-5 h-5" /><span>Exit</span></button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-grow p-10 overflow-y-auto space-y-8 bg-[#f8fbff] custom-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className="flex items-center space-x-2 mb-2 px-2">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${msg.userId === user.id ? 'text-blue-600' : 'text-slate-400'}`}>{msg.userName}</span>
              {['admin', 'pastor'].includes(msg.userRole) && <span className="bg-blue-900 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase">STAFF</span>}
            </div>
            <div className={`max-w-[85%] px-8 py-5 rounded-[2.5rem] shadow-sm text-lg ${msg.userId === user.id ? 'bg-blue-900 text-white rounded-tr-none border-b-4 border-blue-950 shadow-blue-900/10' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-200/50'}`}>
              {msg.text}
            </div>
            <span className="text-[8px] text-slate-300 font-black uppercase mt-2 px-2">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
           {affiliates.filter(l => l.isActive && l.placement === 'community_footer').map(link => (
             <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-5 py-2 bg-blue-50 text-blue-900 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
               <Tag className="w-3 h-3" />
               <span>{link.label}</span>
               <ExternalLink className="w-3 h-3" />
             </a>
           ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Release a word..." 
            className="flex-grow py-5 px-8 bg-slate-50 rounded-full border border-slate-200 focus:outline-none font-medium shadow-inner" 
          />
          <button type="submit" disabled={!input.trim()} className="bg-blue-900 text-white p-5 rounded-full hover:bg-blue-800 shadow-xl disabled:opacity-20 active:scale-95 transition-all"><Send className="w-7 h-7" /></button>
        </form>
      </div>

      {config.communityCustomHtml && (
        <div className="px-8 pb-8" dangerouslySetInnerHTML={{ __html: config.communityCustomHtml }} />
      )}
    </div>
  );
};

export default CommunityChat;
