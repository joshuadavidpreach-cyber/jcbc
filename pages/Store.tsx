
import React, { useState, useEffect } from 'react';
import { User, SiteConfig, Book, AffiliateLink } from '../types';
import { ShoppingBag, Download, Star, BookOpen, ExternalLink, ShieldCheck, ShoppingCart, Loader2 } from 'lucide-react';

interface Props {
  config: SiteConfig;
  user: User | null;
}

const Store: React.FC<Props> = ({ config, user }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBooks(JSON.parse(localStorage.getItem('jcbc_books') || '[]'));
    setAffiliateLinks(JSON.parse(localStorage.getItem('jcbc_affiliate_links') || '[]'));
  }, []);

  const handlePurchase = (book: Book) => {
    if (!user) return alert("You must be logged into the Remnant Portal to access these resources.");
    setLoading(true);
    // Simulated checkout handshake
    setTimeout(() => {
      setLoading(false);
      alert(`Handshake Complete. Access to "${book.title}" granted. Download links are now active below.`);
    }, 1500);
  };

  return (
    <div className="space-y-20 animate-in fade-in duration-700 pb-32">
      <section className="text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-100 text-blue-900 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
          <ShoppingBag className="w-4 h-4" />
          <span>Ecclesiastical Depot</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-black text-blue-900 tracking-tighter uppercase italic leading-none">{config.storeTitle}</h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium italic opacity-70">{config.storeSubtitle}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.length === 0 ? (
            <div className="col-span-full py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 text-center space-y-6">
              <BookOpen className="w-20 h-20 text-slate-100 mx-auto" />
              <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs italic">Prophetic Library Expansion Pending...</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group flex flex-col hover:-translate-y-2 transition-transform duration-500">
                <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                  <img src={book.coverImage} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" alt={book.title} />
                  <div className="absolute top-6 right-6 bg-blue-900 text-white px-6 py-2 rounded-2xl font-bebas text-2xl tracking-widest shadow-2xl">
                    ${book.price}
                  </div>
                </div>
                <div className="p-10 space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">{book.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {book.author}</p>
                    <p className="text-slate-500 text-sm font-medium italic leading-relaxed line-clamp-3">"{book.description}"</p>
                  </div>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <button 
                      onClick={() => handlePurchase(book)}
                      className="w-full py-5 bg-blue-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-blue-800 transition-all active:scale-95"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                      <span>Acquire Resource</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                       <a href={book.epubUrl} className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-400 rounded-xl text-[8px] font-black uppercase hover:bg-slate-200 transition-all">
                         <Download className="w-3 h-3" /> EPUB
                       </a>
                       <a href={book.pdfUrl} className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-400 rounded-xl text-[8px] font-black uppercase hover:bg-slate-200 transition-all">
                         <Download className="w-3 h-3" /> PDF
                       </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-12">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Star className="w-48 h-48" /></div>
             <div className="space-y-4 relative z-10">
               <h4 className="font-bebas text-3xl tracking-widest text-blue-400">Remnant Recommendations</h4>
               <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest italic">Authorized Affiliate Links</p>
             </div>
             <div className="space-y-4 relative z-10">
               {affiliateLinks.filter(l => l.isActive && l.placement === 'global_sidebar').map((link) => (
                 <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                   <div className="flex items-center justify-between">
                     <span className="font-bebas text-xl tracking-widest text-white">{link.label}</span>
                     <ExternalLink className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </a>
               ))}
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
             <ShieldCheck className="w-12 h-12 text-blue-900" />
             <h5 className="font-bebas text-2xl text-blue-900 tracking-widest">Secure Handshake</h5>
             <p className="text-slate-500 text-xs font-medium italic leading-relaxed">All digital assets are cryptographically secured and delivered directly to your portal upon authorization.</p>
          </div>
        </aside>
      </div>

      {config.storeCustomHtml && (
        <div 
          className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-inner"
          dangerouslySetInnerHTML={{ __html: config.storeCustomHtml }}
        />
      )}
    </div>
  );
};

export default Store;
