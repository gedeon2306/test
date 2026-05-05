'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FiChevronLeft, FiChevronRight, FiPlus, FiCalendar,
  FiClock, FiMapPin, FiUser, FiMoreHorizontal,
} from 'react-icons/fi';

const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const days = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }
  
  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i;
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday,
      events: generateEventsForDay(i, month),
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }
  
  return days;
};

const generateEventsForDay = (day: number, month: number) => {
  const events = [];
  
  // Sample events for demonstration
  if (day === 5) {
    events.push({
      id: 1,
      title: 'Réunion équipe',
      time: '10:00',
      type: 'meeting',
      color: '#1a1a1a',
    });
  }
  if (day === 8) {
    events.push({
      id: 2,
      title: 'Deadline projet',
      time: '18:00',
      type: 'deadline',
      color: '#dc2626',
    });
  }
  if (day === 12) {
    events.push({
      id: 3,
      title: 'Review design',
      time: '14:00',
      type: 'review',
      color: '#888580',
    });
  }
  if (day === 15) {
    events.push({
      id: 4,
      title: 'Déploiement',
      time: '09:00',
      type: 'deployment',
      color: '#1d9e75',
    });
  }
  if (day === 20) {
    events.push({
      id: 5,
      title: 'Formation React',
      time: '15:00',
      type: 'training',
      color: '#888580',
    });
  }
  if (day === 25) {
    events.push({
      id: 6,
      title: 'Client presentation',
      time: '11:00',
      type: 'meeting',
      color: '#1a1a1a',
    });
  }
  
  return events;
};

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } as const,
});

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);
  
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const selectedDateEvents = selectedDate 
    ? generateEventsForDay(selectedDate.getDate(), selectedDate.getMonth())
    : [];
  
  const upcomingEvents = [
    {
      id: 7,
      title: 'Sprint planning',
      date: '7 mai',
      time: '09:30',
      type: 'meeting',
      attendees: ['MR', 'AL', 'JD'],
      color: '#1a1a1a',
    },
    {
      id: 8,
      title: 'Code review API',
      date: '9 mai',
      time: '14:00',
      type: 'review',
      attendees: ['JD', 'AL'],
      color: '#888580',
    },
    {
      id: 9,
      title: 'Demo client',
      date: '14 mai',
      time: '10:00',
      type: 'presentation',
      attendees: ['MR', 'JD'],
      color: '#1d9e75',
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1200, padding: '0 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 2px; }
        
        @media (max-width: 768px) {
          .header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .calendar-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .calendar-days {
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 2px !important;
          }
          .calendar-day {
            min-height: 60px !important;
            padding: 4px !important;
          }
          .calendar-day-text {
            font-size: 9px !important;
          }
          .calendar-day-number {
            width: 20px !important;
            height: 20px !important;
            font-size: 9px !important;
          }
          .sidebar-events {
            max-width: none !important;
          }
          .container {
            padding: 0 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-text {
            font-size: 18px !important;
          }
          .button-text {
            font-size: 11px !important;
            padding: 6px 12px !important;
          }
          .calendar-days {
            gap: 1px !important;
          }
          .calendar-day {
            min-height: 50px !important;
            padding: 2px !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 className="header-text" style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Calendrier
            </h2>
            <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
              {MONTHS[month]} {year}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={goToToday}
              className="button-text"
              style={{
                background: '#fff', color: '#1a1a1a', border: '1px solid #e8e6e1',
                borderRadius: 8, padding: '8px 16px', fontSize: 12.5,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f5f4f1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
            >
              Aujourd'hui
            </button>
            <button className="button-text" style={{
              background: '#1a1a1a', color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 16px', fontSize: 12.5,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}>
              <FiPlus size={14} />
              Nouvel événement
            </button>
          </div>
        </div>

        {/* Month navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '12px 16px' }}>
          <button
            onClick={previousMonth}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#888580', padding: 4, borderRadius: 4,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#888580'; }}
          >
            <FiChevronLeft size={16} />
          </button>
          
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>
            {MONTHS[month]} {year}
          </h3>
          
          <button
            onClick={nextMonth}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#888580', padding: 4, borderRadius: 4,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#888580'; }}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </motion.div>

      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Calendar */}
        <motion.div {...fadeUp(1)} style={{
          background: '#fff', border: '1px solid #e8e6e1',
          borderRadius: 12, padding: '16px',
        }}>
          {/* Weekday headers */}
          <div className="calendar-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
            {WEEKDAYS.map(day => (
              <div key={day} className="calendar-day-text" style={{
                textAlign: 'center', fontSize: 11.5, fontWeight: 500,
                color: '#b0aeaa', padding: '8px 0',
              }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="calendar-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {days.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                className="calendar-day"
                style={{
                  minHeight: 80, padding: '6px 4px',
                  border: day.isToday ? '1px solid #1a1a1a' : '1px solid #f0efeb',
                  borderRadius: 8, background: day.isToday ? '#fafaf9' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                  opacity: day.isCurrentMonth ? 1 : 0.4,
                }}
                onClick={() => {
                  if (day.isCurrentMonth) {
                    setSelectedDate(new Date(year, month, day.day));
                  }
                }}
                onMouseEnter={e => { 
                  if (day.isCurrentMonth) {
                    (e.currentTarget as HTMLDivElement).style.background = '#f5f4f1';
                  }
                }}
                onMouseLeave={e => { 
                  (e.currentTarget as HTMLDivElement).style.background = day.isToday ? '#fafaf9' : '#fff';
                }}
              >
                <div className="calendar-day-number" style={{ fontSize: 12, fontWeight: day.isToday ? 500 : 400, color: day.isToday ? '#1a1a1a' : '#888580', marginBottom: 4 }}>
                  {day.day}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {day.events.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      style={{
                        height: 4, background: event.color,
                        borderRadius: 2, width: '100%',
                      }}
                    />
                  ))}
                  {day.events.length > 2 && (
                    <div style={{ fontSize: 9, color: '#b0aeaa' }}>
                      +{day.events.length - 2}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="sidebar-events" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Selected date events */}
          {selectedDate && (
            <motion.div {...fadeUp(2)} style={{
              background: '#fff', border: '1px solid #e8e6e1',
              borderRadius: 12, padding: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>
                  {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
                </h3>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#c8c6c2', padding: 4, borderRadius: 4,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c8c6c2'; }}>
                  <FiPlus size={14} />
                </button>
              </div>
              
              {selectedDateEvents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedDateEvents.map(event => (
                    <div key={event.id} style={{
                      padding: '8px 10px', border: '1px solid #f0efeb',
                      borderRadius: 6, cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: event.color }} />
                        <span style={{ fontSize: 11.5, fontWeight: 500, color: '#1a1a1a' }}>
                          {event.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiClock size={10} style={{ color: '#b0aeaa' }} />
                        <span style={{ fontSize: 11, color: '#888580' }}>{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: '#b0aeaa', margin: 0, textAlign: 'center', padding: '20px 0' }}>
                  Aucun événement ce jour
                </p>
              )}
            </motion.div>
          )}

          {/* Upcoming events */}
          <motion.div {...fadeUp(3)} style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '16px',
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 12px' }}>
              Événements à venir
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingEvents.map(event => (
                <div key={event.id} style={{
                  padding: '10px 12px', border: '1px solid #f0efeb',
                  borderRadius: 6, cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', margin: 0, lineHeight: 1.3 }}>
                      {event.title}
                    </h4>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#c8c6c2', padding: 2, borderRadius: 2,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c8c6c2'; }}>
                      <FiMoreHorizontal size={12} />
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiCalendar size={10} style={{ color: '#b0aeaa' }} />
                      <span style={{ fontSize: 11, color: '#888580' }}>{event.date}</span>
                      <FiClock size={10} style={{ color: '#b0aeaa' }} />
                      <span style={{ fontSize: 11, color: '#888580' }}>{event.time}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiUser size={10} style={{ color: '#b0aeaa' }} />
                      <span style={{ fontSize: 11, color: '#888580' }}>
                        {event.attendees.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
