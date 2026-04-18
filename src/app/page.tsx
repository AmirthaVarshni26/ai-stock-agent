"use client";

import { useChat } from '@ai-sdk/react';
import React from 'react';
import { TrendingUp, MessageSquare, Zap, ArrowUpRight, Search, Send } from "lucide-react";
import { useStockData } from '@/hooks/useStockData';

export default function StockDashboard() {
  const livePrice = useStockData('BINANCE:BTCUSDT');
  
  // Connect to our /api/chat route
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { currentPrice: livePrice }, 
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-yellow-500/30">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 p-4 flex justify-between items-center bg-zinc-900/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Zap className="text-black fill-black" size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter italic">MARKET-AI</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Gen-Agent v1.0</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold">
            <div className={`w-1.5 h-1.5 rounded-full ${livePrice ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {livePrice ? 'WSS CONNECTED: FINNHUB_LIVE' : 'CONNECTING TO STREAM...'}
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-xs uppercase text-zinc-400">
            AV
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Side: Chart Section */}
        <section className="flex-[3] flex flex-col gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col h-full backdrop-blur-sm relative overflow-hidden group">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors"></div>
             
             <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase text-zinc-400">Crypto</span>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">BTC</h2>
                  </div>
                  <p className="text-zinc-500 font-semibold tracking-wide">Bitcoin • Real-Time Stream</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-green-400 mb-1">
                    <ArrowUpRight size={24} strokeWidth={3} />
                    <p className="text-5xl font-mono font-black tracking-tighter">
                      {livePrice ? `$${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Loading...'}
                    </p>
                  </div>
                  <p className="text-zinc-500/50 font-bold text-sm tracking-widest">LIVE MARKET FEED</p>
                </div>
             </div>
             
             <div className="flex-1 w-full bg-black/40 border border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center text-zinc-600 relative group/chart cursor-crosshair">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="p-5 bg-zinc-900 rounded-2xl mb-4 shadow-xl border border-zinc-800 group-hover/chart:border-yellow-500/50 transition-all z-10">
                    <TrendingUp size={40} className={livePrice ? "text-yellow-500" : "text-zinc-500"} />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase z-10">
                  {livePrice ? 'Stream Active' : 'Syncing Canvas...'}
                </p>
                <p className="text-[10px] text-zinc-700 mt-2 z-10 font-mono">
                  {livePrice ? `Received tick for BTC: $${livePrice}` : 'Waiting for next market tick'}
                </p>
             </div>
          </div>
        </section>

        {/* Right Side: AI Analyst Sidebar */}
        <aside className="flex-1 flex flex-col gap-4 min-w-[380px]">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl flex flex-col h-full overflow-hidden backdrop-blur-sm">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-yellow-500" />
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest">Gen-AI Analyst</h3>
                  <p className="text-[8px] text-zinc-500 font-bold tracking-tight">MODE: REAL-TIME ANALYTICS</p>
                </div>
              </div>
              <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black tracking-tighter uppercase text-zinc-400">
                Llama 3.1
              </div>
            </div>
            
            {/* AI Chat History - Dynamically Rendered */}
            <div className="flex-1 p-6 text-sm space-y-6 overflow-y-auto scrollbar-hide">
              {messages.length === 0 && (
                <div className="bg-zinc-800/40 p-4 rounded-2xl rounded-tl-none border border-zinc-700/50 text-zinc-400">
                  <p className="text-[10px] font-black text-yellow-500 mb-2 uppercase tracking-widest">System Ready</p>
                  Waiting for your query. Ask me to analyze the current BTC price action or market trends.
                </div>
              )}
              
              {messages.map((m: any) => (
                <div key={m.id} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl border leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-yellow-500 text-black border-yellow-600 rounded-tr-none font-medium' 
                      : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-300 rounded-tl-none'
                  } max-w-[90%]`}>
                    <p className={`text-[10px] font-black mb-1 uppercase tracking-widest opacity-60 ${
                       m.role === 'user' ? 'text-black' : 'text-yellow-500'
                    }`}>
                      {m.role === 'user' ? 'Amirtha' : 'Analyst'}
                    </p>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area - Integrated with handleInputChange & handleSubmit */}
            <div className="p-6 bg-zinc-900/40 border-t border-zinc-800">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-yellow-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <input 
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about the current price..." 
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-zinc-600 relative z-10"
                />
                <Search className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors z-10" size={18} />
                <button 
                  type="submit" 
                  disabled={!input}
                  className="absolute right-3 top-3 p-1.5 bg-zinc-800 hover:bg-yellow-500 hover:text-black rounded-xl transition-all z-20 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}