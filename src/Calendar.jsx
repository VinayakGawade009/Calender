import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2, X, Code, Monitor, FileText } from 'lucide-react';

export default function Calendar() {
  const [currentMode, setCurrentMode] = useState('range');
  const [activeModalDate, setActiveModalDate] = useState(null);
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateClick = (date) => {
    if (currentMode === 'notepad') {
      setActiveModalDate(date);
      return;
    }

    if (!startDate) {
      setStartDate(date);
    } else if (startDate && !endDate) {
      if (date > startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
      }
    } else if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const emptyDays = Array.from({ length: 3 }, (_, i) => i);
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const remainingSlots = Array.from({ length: 1 }, (_, i) => i);

  const getDayName = (date) => {
    const dayIndex = (3 + date - 1) % 7; 
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return days[dayIndex];
  };

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
              <h1 className="text-white text-3xl font-bold tracking-tight leading-tight mb-1">October 2026</h1>
              <p className="text-white/70 text-[10px] font-semibold tracking-[0.15em] uppercase">The Peak of Autumn</p>
            </div>
          </div>

          {/* Month Notes */}
          <div className="bg-[#eff3f9] rounded-xl p-5 shadow-sm flex-1 flex flex-col min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 font-semibold text-[15px]">Month Notes</h2>
              <button className="text-slate-600 hover:text-slate-900">
                <Edit2 size={15} />
              </button>
            </div>
            <textarea 
              className="w-full flex-1 bg-transparent border-none resize-none focus:ring-0 text-[#9ba5b5] placeholder:text-[#9ba5b5] text-[13px] leading-relaxed p-0 m-0 outline-none" 
              placeholder="General thoughts for the month... Capture your goals, moods, and key reflections here."
              defaultValue="General thoughts for the month... Capture your goals, moods, and key reflections here."
            ></textarea>
          </div>
          
        </div>

        {/* Right Section - 70% Width on desktop */}
        <div className="w-full md:w-[70%] flex flex-col gap-4">
          
          {/* Top Header - Toggle Switch */}
          <div className="flex justify-end">
            <div className="bg-[#f0f4f9] rounded-lg p-1 flex shadow-sm">
              <button 
                onClick={() => setCurrentMode('notepad')}
                className={`px-4 py-1.5 text-[13px] font-semibold rounded-md focus:outline-none transition-colors ${currentMode === 'notepad' ? 'text-indigo-700 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Notepad Mode
              </button>
              <button 
                onClick={() => setCurrentMode('range')}
                className={`px-4 py-1.5 text-[13px] font-semibold rounded-md focus:outline-none transition-colors ${currentMode === 'range' ? 'text-indigo-700 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Range Selection
              </button>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
            
            {/* Modal Overlay */}
            {activeModalDate && (
              <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Purple Header */}
                  <div className="bg-[#332fce] p-6 pb-8 relative shadow-inner">
                    <button 
                      className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                      onClick={(e) => { e.stopPropagation(); setActiveModalDate(null); }}
                    >
                      <X size={18} strokeWidth={2} />
                    </button>
                    <p className="text-white/60 text-[10px] font-bold tracking-[0.15em] uppercase mb-1">{getDayName(activeModalDate)}</p>
                    <h2 className="text-white text-4xl font-bold tracking-tight">Oct {activeModalDate}</h2>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 pt-5 flex flex-col gap-5">
                    
                    {/* Daily Notes */}
                    <div className="flex flex-col gap-2.5">
                       <label className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase">Daily Notes</label>
                       <textarea 
                         className="w-full bg-[#f0f4f9] border border-slate-100/50 rounded-xl p-3.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none min-h-[90px]"
                         placeholder="What's happening today?"
                       ></textarea>
                    </div>

                    {/* Reminders */}
                    <div className="flex flex-col gap-2.5 mt-1">
                       <label className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase">Reminders</label>
                       <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#edf2fe] text-[#423eca] text-[10px] font-bold">
                             <Code size={12} strokeWidth={2.5} /> LeetCode Contest
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#e3f6ea] text-[#138847] text-[10px] font-bold">
                             <Monitor size={12} strokeWidth={2.5} /> Hackathon
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#fce5e8] text-[#c01d32] text-[10px] font-bold">
                             <FileText size={12} strokeWidth={2.5} /> DSBDA Exam
                          </span>
                       </div>
                    </div>

                    {/* Footer Button */}
                    <button 
                      className="w-full mt-1 bg-[#4d4acb] hover:bg-[#342fc7] transition-colors text-white text-[13px] font-semibold py-3.5 rounded-lg shadow-sm"
                      onClick={() => setActiveModalDate(null)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}


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
                const isStart = startDate === date;
                const isEnd = endDate === date;
                const inRange = startDate && endDate && date > startDate && date < endDate;
                
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
                    onClick={() => handleDateClick(date)}
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
