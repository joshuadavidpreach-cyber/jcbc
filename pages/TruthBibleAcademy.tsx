
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { User, SiteConfig, Course, Lesson, AffiliateLink, UserProgress } from '../types';
import { 
  ChevronRight, ArrowLeft, GraduationCap, Star, Play, BookOpen, Clock, Lock, List, ExternalLink, 
  CheckCircle2, Circle, MessageSquare, Send, Sparkles, Loader2
} from 'lucide-react';
import YouTubePlayer from '../components/YouTubePlayer';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Props {
  user: User | null;
  config: SiteConfig;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all border-b-[16px] border-b-blue-900 flex flex-col h-full">
    <div className="aspect-[2/1] relative overflow-hidden bg-slate-900">
      {course.thumbnail ? (
        <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" alt={course.title} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/10"><BookOpen className="w-20 h-20" /></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-10 text-white">
        <div className="space-y-3">
           <div className="flex gap-2">
             <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">{course.category}</span>
             <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">{course.level}</span>
           </div>
           <h3 className="text-3xl font-black uppercase italic tracking-wide leading-tight">{course.title}</h3>
        </div>
      </div>
    </div>
    <div className="p-10 space-y-8 flex-grow flex flex-col justify-between">
      <p className="text-slate-500 font-bold uppercase text-xs leading-relaxed italic line-clamp-3">
        "{course.description || "Entering into the deeper dimensions of spiritual authority and regional dominion."}"
      </p>
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-900 text-[10px] font-black uppercase border border-blue-100 shadow-inner">JD</div>
           <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest opacity-70">{course.instructor}</span>
        </div>
        <Link to={`/academy/course/${course.id}`} className="bg-blue-900 text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl active:scale-95">Enter Frequency</Link>
      </div>
    </div>
  </div>
);

const AcademyLanding: React.FC<{ user: User | null, config: SiteConfig }> = ({ user, config }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateLink[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('jcbc_courses');
    if (saved) setCourses(JSON.parse(saved).filter((c: Course) => c.status === 'published'));
    setAffiliates(JSON.parse(localStorage.getItem('jcbc_affiliate_links') || '[]'));
  }, []);

  return (
    <div className="space-y-16 py-8 animate-in fade-in duration-700">
      <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${config.academyBannerImage})` }}></div>
        <div className="relative z-10 max-w-4xl space-y-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
              <GraduationCap className="w-4 h-4" />
              <span>Kingdom Credentialed</span>
            </div>
            {affiliates.filter(l => l.isActive && l.placement === 'academy_header').map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                <ExternalLink className="w-3 h-3" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-wide uppercase italic leading-tight">{config.academyTitle}</h1>
          <p className="text-xl md:text-2xl text-blue-100 font-bold tracking-wide uppercase italic max-w-2xl">{config.academySubtitle}</p>
          
          {(!user || !user.isEnrolled) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{config.academyPriceText}</span>
                  <span className="text-5xl font-black text-blue-400 italic">${config.academyMonthlyPrice}</span>
                </div>
                <ul className="space-y-4">
                  {[config.academyBenefit1, config.academyBenefit2, config.academyBenefit3, config.academyBenefit4].map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-blue-200/80">
                      <Star className="w-3.5 h-3.5 text-blue-400 fill-current" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] text-blue-100 uppercase font-black tracking-[0.2em] leading-relaxed opacity-60 italic">{config.academyScholarshipText}</p>
                <Link to={user ? "/academy" : "/login"} className="block w-full text-center py-6 bg-white text-blue-900 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                  {user ? config.academyJoinButtonText : "Login to Enroll"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <h2 className="text-5xl font-black text-blue-900 uppercase italic tracking-tighter">Course Catalog</h2>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] hidden sm:block">Dominion Academy v3.0</span>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Awaiting activation of new course rosters...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>
    </div>
  );
};

const LessonView: React.FC<{ user: User | null }> = ({ user }) => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // AI Tutor State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [aiThinking, setAiThinking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_courses');
    if (saved) {
      const allCourses: Course[] = JSON.parse(saved);
      setCourse(allCourses.find(c => c.id === courseId) || null);
    }
    
    // Check completion status
    const allUsers = JSON.parse(localStorage.getItem('jcbc_all_users') || '[]');
    const currentUser = allUsers.find((u: User) => u.id === user?.id);
    if (currentUser?.progress?.completedLessons?.includes(lessonId)) {
        setIsCompleted(true);
    }
  }, [courseId, lessonId, user]);

  if (!user) return <Navigate to="/login" />;
  const lesson = course?.lessons.find(l => l.id === lessonId);
  if (!course || !lesson || !user.isEnrolled) return <div className="p-24 text-center text-slate-400 font-black uppercase tracking-[0.4em] italic">Initializing Prophetic Stream...</div>;

  const markComplete = () => {
      const allUsers = JSON.parse(localStorage.getItem('jcbc_all_users') || '[]');
      const userIndex = allUsers.findIndex((u: User) => u.id === user.id);
      
      if (userIndex === -1) return;
      
      const updatedUser = { ...allUsers[userIndex] };
      if (!updatedUser.progress) updatedUser.progress = { completedLessons: [], enrolledCourses: [], certificates: [] };
      
      if (!updatedUser.progress.completedLessons.includes(lessonId)) {
          updatedUser.progress.completedLessons.push(lessonId);
          setIsCompleted(true);
          localStorage.setItem('jcbc_all_users', JSON.stringify(allUsers));
          
          // Next lesson logic?
          const nextLessonIdx = course.lessons.findIndex(l => l.id === lessonId) + 1;
          if (nextLessonIdx < course.lessons.length) {
              if(confirm("Lesson Complete! Proceed to next lesson?")) {
                  navigate(`/academy/course/${courseId}/lesson/${course.lessons[nextLessonIdx].id}`);
              }
          } else {
              alert("Course Complete! Certification Protocol Initiated.");
          }
      }
  };

  const askTutor = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      
      const userMsg = chatInput;
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
      setChatInput('');
      setAiThinking(true);

      try {
          // Construct context from lesson
          const context = `
            You are an expert biblical tutor for Truth Bible Academy. 
            The student is currently taking the course "${course.title}".
            The current lesson is "${lesson.title}".
            Here are the notes for this lesson: "${lesson.notes.replace(/<[^>]*>?/gm, '')}".
            
            Answer the student's question based strictly on the lesson content and general biblical truth. 
            Keep answers concise, encouraging, and authoritative.
          `;

          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `${context}\n\nStudent Question: ${userMsg}`,
          });

          setChatHistory(prev => [...prev, { role: 'ai', text: response.text || "I apologize, the frequency was interrupted." }]);
      } catch (err) {
          setChatHistory(prev => [...prev, { role: 'ai', text: "Connection to knowledge base failed. Please try again." }]);
      } finally {
          setAiThinking(false);
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 animate-in fade-in duration-700 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => navigate(`/academy/course/${courseId}`)} className="flex items-center space-x-2 text-slate-400 hover:text-blue-900 font-black uppercase tracking-[0.2em] text-[10px] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Roadmap</span>
        </button>
        <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-6 py-2 rounded-full uppercase tracking-[0.2em] border border-blue-100 italic">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-10">
          <div className="aspect-video bg-black rounded-[4rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(30,58,138,0.4)] border-[16px] border-white relative">
            {lesson.youtubeId ? (
              <YouTubePlayer videoId={lesson.youtubeId} title={lesson.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10 italic font-black uppercase tracking-widest p-20 text-center">Ecclesiastical Feed Pending Broadcast</div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
             <div className="space-y-2">
                <h2 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">{lesson.title}</h2>
                <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                   <span className="flex items-center space-x-2 text-blue-900"><Play className="w-4 h-4" /> <span>High Authority Feed</span></span>
                   <span className="flex items-center space-x-2"><Clock className="w-4 h-4" /> <span>{lesson.duration || "N/A"}</span></span>
                </div>
             </div>
             <button 
                onClick={markComplete} 
                disabled={isCompleted}
                className={`px-8 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 shadow-xl transition-all ${isCompleted ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-900 text-white hover:bg-blue-800 active:scale-95'}`}
             >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                <span>{isCompleted ? 'Lesson Completed' : 'Mark Complete'}</span>
             </button>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 space-y-8">
             <h4 className="font-bebas text-3xl text-blue-900 border-b border-slate-100 pb-4">Kingdom Notes</h4>
             <div 
               className="prose prose-slate max-w-none prose-headings:font-bebas prose-headings:uppercase prose-p:font-medium prose-p:italic prose-p:text-slate-500"
               dangerouslySetInnerHTML={{ __html: lesson.notes || "<p>Notes pending transcription...</p>" }} 
             />
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-8">
          {/* AI Tutor Panel */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 overflow-hidden flex flex-col h-[600px] sticky top-8">
             <div className="bg-blue-900 p-6 flex items-center gap-3 text-white">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="font-bebas text-xl tracking-widest">AI Tutor</span>
             </div>
             <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
                {chatHistory.length === 0 && (
                   <div className="text-center p-8 opacity-40">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Ask me anything about this lesson.</p>
                   </div>
                )}
                {chatHistory.map((msg, i) => (
                   <div key={i} className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.role === 'user' ? 'bg-white ml-8 shadow-sm text-blue-900' : 'bg-blue-100 mr-8 text-slate-700'}`}>
                      {msg.text}
                   </div>
                ))}
                {aiThinking && <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 animate-pulse text-center">Analysing Scriptures...</div>}
             </div>
             <form onSubmit={askTutor} className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                   <input 
                     value={chatInput}
                     onChange={e => setChatInput(e.target.value)}
                     placeholder="Ask a question..."
                     className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                   />
                   <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-2 p-1 text-blue-900 hover:scale-110 transition-transform"><Send className="w-4 h-4" /></button>
                </div>
             </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

const CourseDetail: React.FC<{ user: User | null }> = ({ user }) => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_courses');
    if (saved) {
      const all: Course[] = JSON.parse(saved);
      setCourse(all.find(c => c.id === id) || null);
    }
    
    // Get Progress
    const allUsers = JSON.parse(localStorage.getItem('jcbc_all_users') || '[]');
    const currentUser = allUsers.find((u: User) => u.id === user?.id);
    if (currentUser?.progress?.completedLessons) {
        setProgress(currentUser.progress.completedLessons);
    }
  }, [id, user]);

  if (!user || !user.isEnrolled) return <Navigate to="/academy" />;
  if (!course) return <Navigate to="/academy" />;

  const completionPct = Math.round((course.lessons.filter(l => progress.includes(l.id)).length / Math.max(course.lessons.length, 1)) * 100);

  return (
    <div className="space-y-16 py-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <Link to="/academy" className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-900 font-black uppercase tracking-[0.2em] text-[10px] transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Catalog</span>
      </Link>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h1 className="text-6xl md:text-7xl font-black text-blue-900 uppercase italic tracking-tighter leading-[0.85]">{course.title}</h1>
           <div className="text-right hidden sm:block">
              <span className="text-4xl font-black text-blue-200">{completionPct}%</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Complete</p>
           </div>
        </div>
        
        <div className="flex items-center space-x-4 text-slate-400 border-b border-slate-100 pb-8">
          <div className="w-1.5 h-1.5 bg-blue-900 rounded-full" />
          <p className="font-black uppercase tracking-[0.3em] text-[10px]">Head Instructor: {course.instructor}</p>
          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
          <p className="font-black uppercase tracking-[0.3em] text-[10px]">{course.level}</p>
        </div>
        
        {/* Progress Bar Mobile */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden sm:hidden">
           <div className="bg-blue-900 h-full transition-all duration-1000" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center text-[11px] font-black uppercase tracking-[0.4em] text-blue-900 mb-10">
           <List className="w-5 h-5 mr-3" />
           <span>Frequency Roadmap</span>
        </div>
        
        {course.lessons.length === 0 ? (
          <div className="p-20 border-4 border-dashed border-slate-100 rounded-[4rem] text-center text-slate-300 text-sm font-black uppercase tracking-[0.3em] italic">Roadmap Pending Activation</div>
        ) : (
          course.lessons.sort((a,b) => a.order - b.order).map((lesson, idx) => {
            const isDone = progress.includes(lesson.id);
            return (
              <Link key={lesson.id} to={`/academy/course/${course.id}/lesson/${lesson.id}`} className="flex items-center justify-between p-8 bg-white rounded-[3rem] border border-slate-50 hover:border-blue-900 shadow-xl transition-all group active:scale-[0.98]">
                <div className="flex items-center space-x-8">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl transition-all shadow-inner border border-slate-100 ${isDone ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-white'}`}>
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div className="space-y-1">
                     <h3 className="font-black text-blue-900 uppercase italic text-2xl group-hover:translate-x-3 transition-transform leading-none">{lesson.title}</h3>
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{lesson.duration || "Standard Session"}</span>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-blue-900 group-hover:translate-x-4 transition-all" />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

const TruthBibleAcademy: React.FC<Props> = ({ user, config }) => {
  return (
    <Routes>
      <Route path="/" element={<AcademyLanding user={user} config={config} />} />
      <Route path="/course/:id" element={<CourseDetail user={user} />} />
      <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView user={user} />} />
    </Routes>
  );
};

export default TruthBibleAcademy;
