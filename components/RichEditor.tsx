
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Image as ImageIcon, Heading1, Heading2, List, 
  Eye, Code, Type, Video, Link as LinkIcon, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, Palette, ChevronDown,
  Upload, ImagePlus, MonitorPlay, Facebook, Youtube, 
  Type as TypeIcon, Minus, Plus as PlusIcon, Settings2, GripVertical,
  SearchCheck, ListOrdered, Columns, LayoutTemplate
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string; // Added ID prop to prevent collisions
}

const FONTS = [
  { name: 'Bebas Neue (Remnant Bold)', value: "'Bebas Neue', sans-serif" },
  { name: 'Default (Inter)', value: "'Inter', sans-serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Lora (Classic)', value: "'Lora', serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Courier Mono', value: "'Courier Prime', monospace" },
];

const COLORS = [
  { name: 'Default', value: 'inherit' },
  { name: 'Remnant Blue', value: '#1e3a8a' },
  { name: 'Holy Fire Red', value: '#dc2626' },
  { name: 'Spirit Gold', value: '#ca8a04' },
  { name: 'Ethereal White', value: '#ffffff' },
  { name: 'Deep Slate', value: '#334155' },
];

const SIZES = [
  { label: 'Caption', value: '0.75rem' },
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Large', value: '1.25rem' },
  { label: 'Title', value: '1.875rem' },
  { label: 'Headline', value: '2.5rem' },
  { label: 'Giant', value: '4rem' },
];

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder, id }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [editorHeight, setEditorHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  
  // Generate a stable unique ID if one isn't provided
  const editorId = useRef(id || `editor-${Math.random().toString(36).substr(2, 9)}`).current;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - containerRect.top - 50; 
      if (newHeight > 200) {
        setEditorHeight(newHeight);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const insertText = (before: string, after: string = '') => {
    if (isPreview) setIsPreview(false);
    const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
    if (!textarea) {
      onChange(value + before + after);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const wrapStyle = (property: string, val: string) => {
    insertText(`<span style="${property}: ${val}">`, `</span>`);
    setShowFonts(false);
    setShowColors(false);
    setShowSizes(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const altText = prompt("SEO ALT-TEXT: Describe this image for Search & AI Engines:", "Jesus Culture Bible Church Media");
        const title = prompt("IMAGE TITLE: Tooltip name for this image:", "JCBC Media");
        const align = prompt("ALIGNMENT: 'left', 'right', or 'center' (default)?", "center");
        
        let classes = "shadow-2xl border-4 border-white rounded-[2.5rem] ";
        if (align?.toLowerCase() === 'left') classes += "float-left mr-8 mb-8 max-w-sm";
        else if (align?.toLowerCase() === 'right') classes += "float-right ml-8 mb-8 max-w-sm";
        else classes += "w-full block mx-auto";

        insertText(`<img src="${reader.result}" alt="${altText || 'Church Media'}" title="${title || 'JCBC Media'}" class="${classes}" />\n`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = () => {
    const url = prompt('Enter Video Frequency (YouTube, Facebook, MP4, or Stream URL):');
    if (!url) return;
    
    let embedHtml = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : '';
      if (videoId) {
        embedHtml = `\n<div class="aspect-video w-full rounded-[3rem] overflow-hidden my-10 shadow-2xl border-[10px] border-white bg-slate-900"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>\n`;
      }
    } 
    else if (url.includes('facebook.com')) {
      embedHtml = `\n<div class="w-full flex justify-center my-10 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white bg-slate-900"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560" width="100%" height="315" style="border:none;overflow:hidden;min-height:315px;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>\n`;
    }
    else if (url.endsWith('.mp4') || url.endsWith('.m3u8') || url.includes('/video/')) {
       embedHtml = `\n<div class="w-full my-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-black"><video controls class="w-full"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video></div>\n`;
    }
    else {
       embedHtml = `\n<div class="aspect-video w-full rounded-[2rem] overflow-hidden my-10 shadow-2xl bg-slate-100"><iframe src="${url}" class="w-full h-full border-0"></iframe></div>\n`;
    }

    if (embedHtml) insertText(embedHtml);
    else alert("Frequency unrecognized. Please provide a standard video link.");
  };

  const insertTwoColumns = () => {
    insertText(`
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-start">
  <div class="space-y-4">
    <p class="text-xl font-bold text-blue-900">Left Column</p>
    <p>Insert content here...</p>
  </div>
  <div class="space-y-4">
    <p class="text-xl font-bold text-blue-900">Right Column</p>
    <p>Insert content here...</p>
  </div>
</div>
`);
  };

  return (
    <div ref={containerRef} className={`border border-slate-200 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl transition-all ${isResizing ? 'select-none ring-4 ring-blue-500/20' : 'focus-within:ring-4 focus-within:ring-blue-500/10'}`}>
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Formatting Tools */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button type="button" onClick={() => insertText('<b>', '</b>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<i>', '</i>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<u>', '</u>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Underline"><Underline className="w-4 h-4" /></button>
          </div>

          {/* Heading Tools */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button type="button" onClick={() => insertText('<h2 class="text-4xl font-bebas text-blue-900 mt-8 mb-4 tracking-widest uppercase italic">', '</h2>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<h3 class="text-2xl font-bebas text-blue-900 mt-6 mb-3 tracking-wide">', '</h3>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
          </div>

          {/* Alignment Tools */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button type="button" onClick={() => insertText('<div class="text-left">', '</div>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><AlignLeft className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<div class="text-center">', '</div>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><AlignCenter className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<div class="text-right">', '</div>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><AlignRight className="w-4 h-4" /></button>
          </div>

          {/* List Tools */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button type="button" onClick={() => insertText('<ul class="list-disc ml-8 space-y-2"><li>', '</li></ul>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<ol class="list-decimal ml-8 space-y-2"><li>', '</li></ol>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ListOrdered className="w-4 h-4" /></button>
          </div>

          {/* Advanced Media */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm gap-1">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Kingdom Image Upload"><ImagePlus className="w-4 h-4" /></button>
            <button type="button" onClick={handleAddVideo} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Universal Video Insert"><MonitorPlay className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertText('<a href="#" target="_blank" class="text-blue-900 font-black underline">', '</a>')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Hyperlink"><LinkIcon className="w-4 h-4" /></button>
            <button type="button" onClick={insertTwoColumns} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="2-Column Layout"><Columns className="w-4 h-4" /></button>
          </div>

          {/* Theme Tuning */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm gap-1">
            <div className="relative">
              <button onClick={() => { setShowColors(!showColors); setShowFonts(false); setShowSizes(false); }} className="p-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1" title="Text Color">
                <Palette className="w-4 h-4 text-blue-900" />
              </button>
              {showColors && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border rounded-2xl shadow-2xl p-2 w-48 animate-in fade-in slide-in-from-top-2">
                  {COLORS.map(c => (
                    <button key={c.value} onClick={() => wrapStyle('color', c.value)} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ background: c.value }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setShowFonts(!showFonts); setShowColors(false); setShowSizes(false); }} className="p-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1" title="Font Family">
                <Type className="w-4 h-4 text-slate-700" />
              </button>
              {showFonts && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border rounded-2xl shadow-2xl p-2 w-56 animate-in fade-in slide-in-from-top-2">
                   {FONTS.map(f => (
                    <button key={f.value} onClick={() => wrapStyle('font-family', f.value)} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-xs flex items-center gap-2" style={{ fontFamily: f.value }}>
                      {f.name}
                    </button>
                   ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setShowSizes(!showSizes); setShowFonts(false); setShowColors(false); }} className="p-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1" title="Font Size">
                <TypeIcon className="w-4 h-4 text-slate-700" />
              </button>
              {showSizes && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border rounded-2xl shadow-2xl p-2 w-40 animate-in fade-in slide-in-from-top-2">
                   {SIZES.map(s => (
                    <button key={s.value} onClick={() => wrapStyle('font-size', s.value)} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                      <span>{s.label}</span>
                      <span className="text-[10px] text-slate-400">{s.value}</span>
                    </button>
                   ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button type="button" onClick={() => setIsPreview(false)} className={`flex items-center space-x-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isPreview ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}><Code className="w-4 h-4" /><span>Code</span></button>
          <button type="button" onClick={() => setIsPreview(true)} className={`flex items-center space-x-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isPreview ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}><Eye className="w-4 h-4" /><span>Preview</span></button>
        </div>
      </div>

      <div className="relative bg-white overflow-y-auto custom-scrollbar" style={{ height: `${editorHeight}px` }}>
        {isPreview ? (
          <div className="p-12 prose prose-slate max-w-none animate-in fade-in duration-300" dangerouslySetInnerHTML={{ __html: value || `<div class="py-20 text-center opacity-30 italic font-black uppercase tracking-widest text-xs">Awaiting Divine Inspiration...</div>` }} />
        ) : (
          <textarea id={editorId} ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "Release the Word..."} className="w-full h-full p-12 focus:outline-none font-mono text-sm leading-relaxed bg-slate-50/10 resize-none" />
        )}
      </div>

      <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 relative">
        <div className="flex items-center space-x-3 italic">
           <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${isPreview ? 'bg-green-500' : 'bg-blue-900'}`} />
           <span className="flex items-center gap-1"><SearchCheck className="w-3 h-3 text-blue-900" /> Remnant Scribe System Active</span>
        </div>
        <div onMouseDown={startResizing} className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center cursor-ns-resize hover:bg-blue-900 hover:text-white transition-colors group"><GripVertical className="w-4 h-4 rotate-45 opacity-50 group-hover:opacity-100" /></div>
      </div>
    </div>
  );
};
export default RichEditor;
