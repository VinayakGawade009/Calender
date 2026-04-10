import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Edit2, X, Code, Monitor, FileText } from 'lucide-react';

const AVAILABLE_REMINDERS = [
  { id: 'leetcode', label: 'LeetCode Contest', icon: Code, color: 'text-[#423eca]', bg: 'bg-[#edf2fe]', border: 'border-[#edf2fe]', dotBg: 'bg-[#423eca]' },
  { id: 'hackathon', label: 'Hackathon', icon: Monitor, color: 'text-[#138847]', bg: 'bg-[#e3f6ea]', border: 'border-[#e3f6ea]', dotBg: 'bg-[#138847]' },
  { id: 'dsbda', label: 'DSBDA Exam', icon: FileText, color: 'text-[#c01d32]', bg: 'bg-[#fce5e8]', border: 'border-[#fce5e8]', dotBg: 'bg-[#c01d32]' }
];

const HOLIDAYS = {
  '2026-7-15': 'Independence Day',
  '2026-0-26': 'Republic Day'
};

const MONTH_DATA = [
  { image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1000&auto=format&fit=crop", subtitle: "Deep Winter" },
  { image: "https://images.unsplash.com/photo-1478719059408-592965723cbc?q=80&w=1000&auto=format&fit=crop", subtitle: "Late Frost" },
  { image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop", subtitle: "First Bloom" },
  { image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1000&auto=format&fit=crop", subtitle: "Spring Awakening" },
  { image: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?q=80&w=1000&auto=format&fit=crop", subtitle: "Lush Greenery" },
  { image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000&auto=format&fit=crop", subtitle: "Early Summer" },
  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop", subtitle: "Ocean Breeze" },
  { image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1000&auto=format&fit=crop", subtitle: "Summer Sunsets" },
  { image: "https://images.unsplash.com/photo-1605571926314-ae21581e420f?q=80&w=1000&auto=format&fit=crop", subtitle: "Crisp Air" },
  { image: "https://images.unsplash.com/photo-1476837579993-f1d3948f17c2?q=80&w=1000&auto=format&fit=crop", subtitle: "The Peak of Autumn" },
  { image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?q=80&w=1000&auto=format&fit=crop", subtitle: "Bare Branches" },
  { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", subtitle: "Winter Solstice" }
];

export default function Calendar() {
  // Stage 5: Current Date Management
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const emptyDays = Array.from({ length: startingDayIndex }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalSlotsRendered = emptyDays.length + monthDays.length;
  const rowsNeeded = Math.ceil(totalSlotsRendered / 7);
  const totalSlotsToFill = rowsNeeded * 7;
  const remainingSlots = Array.from({ length: totalSlotsToFill - totalSlotsRendered }, (_, i) => i);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const monthShort = currentDate.toLocaleString('default', { month: 'short' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setStartDate(null);
    setEndDate(null);
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setStartDate(null);
    setEndDate(null);
  };

  const [currentMode, setCurrentMode] = useState('range');
  const [activeModalDate, setActiveModalDate] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [dayData, setDayData] = useState({});
  const [modalText, setModalText] = useState('');
  const [modalReminders, setModalReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState('');

  const getFormattedDate = (y, m, d) => {
    return `${y}-${m}-${d}`;
  };

  const calendarGridRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currentMode === 'range' && calendarGridRef.current && !calendarGridRef.current.contains(event.target)) {
        setStartDate(null);
        setEndDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentMode]);

  useEffect(() => {
    const savedData = localStorage.getItem('calendarNotes');
    if (savedData) {
      try {
        setDayData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse calendar notes from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(dayData));
  }, [dayData]);

  const handleDateClick = (date) => {
    if (currentMode === 'notepad') {
      const data = dayData[date] || { text: '', reminders: [] };
      setModalText(data.text || '');
      setModalReminders(data.reminders || []);
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

  const handleSaveModal = () => {
    setDayData(prev => ({
      ...prev,
      [activeModalDate]: { text: modalText, reminders: modalReminders }
    }));
    setActiveModalDate(null);
  };

  const handleAddReminder = () => {
    if (newReminderText.trim()) {
      setModalReminders(prev => [...prev, newReminderText.trim()]);
      setNewReminderText('');
    }
  };

  const toggleReminder = (id) => {
    setModalReminders(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getDayName = (dateNum) => {
    const specificDate = new Date(year, month, dateNum);
    return specificDate.toLocaleString('default', { weekday: 'long' }).toUpperCase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#f5f7fa]">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6">

        {/* Left Section */}
        <div className="w-full md:w-[30%] flex flex-col gap-6">

          <div className="relative rounded-xl overflow-hidden shadow-sm aspect-square bg-slate-200">
            <img
              src={MONTH_DATA[month].image}
              alt="Dynamic Month Landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5">
              <h1 className="text-white text-3xl font-bold tracking-tight leading-tight mb-1">{monthName} {year}</h1>
              <p className="text-white/70 text-[10px] font-semibold tracking-[0.15em] uppercase">{MONTH_DATA[month].subtitle}</p>
            </div>
          </div>

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
            ></textarea>
          </div>

        </div>

        {/* Right Section */}
        <div className="w-full md:w-[70%] flex flex-col gap-4">

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

          <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">

            {activeModalDate && (
              <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-[#332fce] p-6 pb-8 relative shadow-inner">
                    <button
                      className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                      onClick={(e) => { e.stopPropagation(); setActiveModalDate(null); }}
                    >
                      <X size={18} strokeWidth={2} />
                    </button>
                    <p className="text-white/60 text-[10px] font-bold tracking-[0.15em] uppercase mb-1">{getDayName(activeModalDate)}</p>
                    <h2 className="text-white text-4xl font-bold tracking-tight">{monthShort} {activeModalDate}</h2>
                    {HOLIDAYS[getFormattedDate(year, month, activeModalDate)] && (
                      <p className="text-red-500 text-[13px] font-bold mt-1">✨ {HOLIDAYS[getFormattedDate(year, month, activeModalDate)]}</p>
                    )}
                  </div>

                  <div className="p-6 pt-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase">Daily Notes</label>
                      <textarea
                        value={modalText}
                        onChange={(e) => setModalText(e.target.value)}
                        className="w-full bg-[#f0f4f9] border border-slate-100/50 rounded-xl p-3.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none min-h-[90px]"
                        placeholder="What's happening today?"
                      ></textarea>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-1">
                      <label className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase">Reminders</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_REMINDERS.map(rem => {
                          const Icon = rem.icon;
                          const isSelected = modalReminders.includes(rem.id);
                          const chipClasses = isSelected
                            ? `${rem.bg} ${rem.color} border-transparent`
                            : `bg-white text-slate-400 border-slate-200 hover:bg-slate-50`;

                          return (
                            <button
                              key={rem.id}
                              onClick={() => toggleReminder(rem.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors focus:outline-none ${chipClasses}`}
                            >
                              <Icon size={12} strokeWidth={2.5} /> {rem.label}
                            </button>
                          );
                        })}
                        {modalReminders.filter(id => !AVAILABLE_REMINDERS.some(r => r.id === id)).map((text, idx) => (
                          <button
                            key={`custom-${idx}`}
                            onClick={() => toggleReminder(text)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors focus:outline-none bg-[#f1f3f5] text-slate-600 border-transparent hover:bg-[#e9ecef]"
                          >
                            <X size={10} strokeWidth={2.5} /> {text}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2.5 mt-2">
                        <input
                          type="text"
                          placeholder="Add custom reminder..."
                          value={newReminderText}
                          onChange={(e) => setNewReminderText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddReminder()}
                          className="flex-1 bg-white border border-slate-200/80 rounded-md px-3 py-1.5 text-[11px] text-slate-700 outline-none focus:border-indigo-400"
                        />
                        <button
                          onClick={handleAddReminder}
                          className="bg-slate-800 text-white px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-slate-700 transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveModal}
                      className="w-full mt-1 bg-[#4d4acb] hover:bg-[#342fc7] transition-colors text-white text-[13px] font-semibold py-3.5 rounded-lg shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-6 pb-5">
              <h2 className="text-[20px] font-bold text-slate-900">{monthName} {year}</h2>
              <div className="flex space-x-6 pr-2">
                <button onClick={handlePrevMonth} className="text-slate-800 hover:text-black"><ChevronLeft size={16} strokeWidth={2.5} /></button>
                <button onClick={handleNextMonth} className="text-slate-800 hover:text-black"><ChevronRight size={16} strokeWidth={2.5} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4 px-1">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-[9px] font-bold text-slate-600 tracking-[0.15em]">
                  {day}
                </div>
              ))}
            </div>

            <div ref={calendarGridRef} className="grid grid-cols-7 flex-1 border-t border-l border-gray-200 w-[calc(100%+1px)] -ml-[1px]">
              {emptyDays.map(i => (
                <div key={`empty-${i}`} className="bg-[#e5eaf2]/30 border-r border-b border-gray-200"></div>
              ))}

              {monthDays.map(date => {
                const isStart = startDate === date;
                const isEnd = endDate === date;
                const inRange = startDate && endDate && date > startDate && date < endDate;

                const data = dayData[date];
                const hasNotes = data?.text?.trim()?.length > 0;
                const activeRems = data?.reminders || [];

                const currentDateFormatted = getFormattedDate(year, month, date);
                const holidayName = HOLIDAYS[currentDateFormatted];
                const isSunday = new Date(year, month, date).getDay() === 0;

                const todayObj = new Date();
                const isToday =
                  todayObj.getDate() === date &&
                  todayObj.getMonth() === month &&
                  todayObj.getFullYear() === year;

                let cellClasses = "bg-white text-slate-800 hover:bg-slate-50";

                if (isStart || isEnd) {
                  cellClasses = "bg-[#3331b9] text-white";
                } else if (inRange) {
                  cellClasses = "bg-[#b8bcee] text-[#3331b9]";
                } else if (isToday) {
                  cellClasses = "bg-indigo-50/40 text-indigo-700 font-extrabold relative z-0 before:absolute before:inset-0 before:border-2 before:border-indigo-400 before:z-[-1]";
                }

                return (
                  <div
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`min-h-[85px] border-r border-b border-gray-200 flex flex-col p-3 pb-2 cursor-pointer transition-colors relative ${cellClasses}`}
                  >
                    <span className={`text-[13px] ${isToday && !isStart && !isEnd ? 'font-extrabold' : 'font-semibold'} ${isSunday || holidayName ? 'text-red-500' : ''}`}>{date}</span>

                    <div className="flex justify-start gap-1 w-full mt-1.5 mb-1 flex-wrap">
                      {hasNotes && <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
                      {activeRems.map(remId => {
                        const rem = AVAILABLE_REMINDERS.find(r => r.id === remId);
                        if (!rem) return null;
                        return <div key={remId} className={`w-1.5 h-1.5 rounded-full ${rem.dotBg}`}></div>;
                      })}
                    </div>

                    {holidayName && (
                      <div className="text-[8px] text-red-500 font-bold leading-none truncate w-full mt-auto tracking-tight">
                        {holidayName}
                      </div>
                    )}
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
