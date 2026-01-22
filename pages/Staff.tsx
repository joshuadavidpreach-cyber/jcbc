
import React, { useState, useEffect } from 'react';
import { SiteConfig, User, StaffMember } from '../types';
import { Users, Mail, Edit3, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  config: SiteConfig;
  user: User | null;
}

const Staff: React.FC<Props> = ({ config, user }) => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const isAdmin = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'staff';

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_staff');
    if (saved) {
      setStaff(JSON.parse(saved).sort((a: StaffMember, b: StaffMember) => a.order - b.order));
    }
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <section className="text-center space-y-8 py-12">
        <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-100 text-blue-900 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
          <Users className="w-4 h-4" />
          <span>Servant Leadership</span>
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin?tab=staff')}
              className="ml-2 p-1 bg-blue-200 rounded-full hover:bg-blue-300 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-blue-900 tracking-tighter uppercase italic leading-none">
            {config.staffPageTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium italic opacity-70 max-w-3xl mx-auto">
            "{config.staffPageSubtitle}"
          </p>
        </div>
      </section>

      {staff.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
           <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs italic">Leadership Roster Pending...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {staff.map((member) => (
            <div key={member.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 group hover:shadow-2xl transition-all duration-500">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Users className="w-20 h-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   {member.email && (
                     <a href={`mailto:${member.email}`} className="text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline">
                        <Mail className="w-4 h-4" /> Contact
                     </a>
                   )}
                </div>
              </div>
              <div className="p-10 space-y-4 relative">
                <div className="absolute -top-8 right-8 bg-blue-900 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-all duration-500">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tight leading-none">{member.name}</h3>
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest mt-2">{member.role}</p>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {config.staffCustomHtml && (
        <div 
          className="pt-20 border-t border-slate-100"
          dangerouslySetInnerHTML={{ __html: config.staffCustomHtml }}
        />
      )}
    </div>
  );
};

export default Staff;
