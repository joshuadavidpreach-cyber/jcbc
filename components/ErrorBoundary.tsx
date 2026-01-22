
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('System Anomaly Detected:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200 text-center space-y-8 max-w-md animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto border border-red-100 shadow-inner">
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <h2 className="font-bebas text-4xl text-blue-900 tracking-wide">Frequency Interrupted</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                An unexpected anomaly has occurred in the system protocol. The Scribes have been notified.
              </p>
            </div>

            <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-[10px] font-mono text-left overflow-auto max-h-32 border border-slate-800 shadow-inner">
              <span className="text-red-400 font-bold block mb-2">ERROR_TRACE_LOG:</span>
              {this.state.error?.message || "Unknown error state."}
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reboot System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
