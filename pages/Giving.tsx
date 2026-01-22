import React from 'react';
import { SiteConfig } from '../types';
import { Heart, Coins, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface Props {
  config: SiteConfig;
}

const Giving: React.FC<Props> = ({ config }) => {
  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <section className="text-center space-y-8 py-12">
        <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-100 text-blue-900 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
          <Coins className="w-4 h-4" />
          <span>Kingdom Stewardship</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-blue-900 tracking-tighter uppercase italic leading-none">{config.givingTitle}</h1>
          <div className="max-w-3xl mx-auto p-10 bg-white rounded-[3rem] shadow-xl border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-900" />
            <p className="text-2xl text-slate-700 font-bold italic leading-relaxed">{config.givingSubtitle}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        <div className="bg-blue-900 text-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Heart className="w-64 h-64 rotate-12" /></div>
          <div className="space-y-8 relative z-10">
            <h3 className="text-4xl font-black uppercase italic tracking-tight">{config.givingBodyTitle}</h3>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">{config.givingBodyText}</p>
            <ul className="space-y-4">
              {[config.givingBenefit1, config.givingBenefit2, config.givingBenefit3, config.givingBenefit4].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm font-bold uppercase tracking-widest text-blue-200">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <a href={config.givingUrl} target="_blank" rel="noopener noreferrer" className="mt-12 group flex items-center justify-between bg-white text-blue-900 p-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xl shadow-xl hover:bg-blue-50 transition-all active:scale-95">
            <span>{config.givingButtonText}</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900"><ShieldCheck className="w-8 h-8" /></div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-blue-900 uppercase italic">{config.givingSecureTitle}</h4>
                <p className="text-slate-500 font-medium">{config.givingSecureText}</p>
              </div>
           </div>
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl space-y-6">
              <h4 className="text-2xl font-black uppercase italic text-blue-400">{config.givingTheologyTitle}</h4>
              <p className="text-blue-100 font-medium leading-relaxed">{config.givingTheologyText}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Giving;