import React from 'react';
import { ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

export default function Calendar() {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const emptyDays = Array.from({ length: 3 }, (_, i) => i);
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const remainingSlots = Array.from({ length: 1 }, (_, i) => i);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#f5f7fa]">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6">
        
        {/* Left Section - 30% Width on desktop */}
        <div className="w-full md:w-[30%] flex flex-col gap-6">
          
          {/* Hero Image */}
          <div className="relative rounded-xl overflow-hidden shadow-sm aspect-square bg-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1549880338-65dd4bd84152?q=80&w=1000&auto=format&fit=crop" 
              alt="Mountain Landscape" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5">
              <h1 className="text-white text-2xl font-bold tracking-tight leading-tight mb-1">October 2026</h1>
              <p className="text-white/70 text-[9px] font-semibold tracking-[0.2em] uppercase">The Peak of Autumn</p>
            </div>
          </div>

          {/* Month Notes */}
          <div className="bg-[#eff3f9] rounded-xl p-5 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 font-semibold text-[15px]">Month Notes</h2>
              <button className="text-slate-600 hover:text-slate-900">
                <Edit2 size={15} />
              </button>
            </div>
            <textarea 
              className="w-full flex-1 bg-transparent border-none resize-none focus:ring-0 text-[#9ba5b5] placeholder:text-[#9ba5b5] text-[13px] leading-relaxed p-0 m-0" 
              placeholder="General thoughts for the month... Capture your goals, moods, and key reflections here."
              defaultValue="General thoughts for the month... Capture your goals, moods, and key reflections here."
            ></textarea>
          </div>
          
        </div>

        {/* Right Section - 70% Width on desktop */}
        <div className="w-full md:w-[70%] flex flex-col gap-4">
          
          {/* Top Header - Toggle Switch Placeholder */}
          <div className="flex justify-end">
            <div className="bg-[#f0f4f9] rounded-lg p-1 flex shadow-sm">
              <button className="px-4 py-1.5 text-[13px] font-semibold text-slate-500 rounded-md focus:outline-none hover:text-slate-700">
                Notepad Mode
              </button>
              <button className="px-4 py-1.5 text-[13px] font-semibold text-indigo-700 bg-white rounded-md shadow-sm focus:outline-none">
                Range Selection
              </button>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 pb-5">
              <h2 className="text-[20px] font-bold text-slate-900">October 2026</h2>
              <div className="flex space-x-6 pr-2">
                <button className="text-slate-800 hover:text-black"><ChevronLeft size={16} strokeWidth={2.5} /></button>
                <button className="text-slate-800 hover:text-black"><ChevronRight size={16} strokeWidth={2.5} /></button>
              </div>
            </div>
              
            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4 px-1">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-[9px] font-bold text-slate-600 tracking-[0.15em]">
                  {day}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 flex-1 border-t border-l border-gray-200 w-[calc(100%+1px)] -ml-[1px]">
              {emptyDays.map(i => (
                <div key={`empty-${i}`} className="bg-[#e5eaf2]/30 border-r border-b border-gray-200"></div>
              ))}
              
              {monthDays.map(date => {
                const isStart = date === 10;
                const isEnd = date === 15;
                const inRange = date > 10 && date < 15;
                
                let cellClasses = "bg-white text-slate-800 hover:bg-slate-50";
                
                if (isStart || isEnd) {
                  cellClasses = "bg-[#3331b9] text-white";
                } else if (inRange) {
                  cellClasses = "bg-[#b8bcee] text-[#3331b9]";
                }

                const hasGreenDot = date === 3;
                const hasRedDot = date === 20;

                return (
                  <div 
                    key={date} 
                    className={`min-h-[85px] border-r border-b border-gray-200 flex flex-col p-3 pb-2 cursor-pointer transition-colors ${cellClasses}`}
                  >
                    <span className="text-[13px] font-semibold">{date}</span>
                    <div className="flex-1"></div>
                    
                    <div className="flex justify-between w-full h-[4px]">
                       {hasRedDot ? (
                          <div className="w-[3px] h-[3px] rounded-full bg-red-600 self-end ml-1"></div>
                       ) : (
                          <div></div>
                       )}
                       {hasGreenDot && (
                          <div className="w-[3px] h-[3px] rounded-full bg-emerald-600 self-end mr-1"></div>
                       )}
                    </div>
                  </div>
                );
              })}
              
              {remainingSlots.map(i => (
                <div key={`rem-${i}`} className="bg-[#e5eaf2]/30 border-r border-b border-gray-200"></div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
