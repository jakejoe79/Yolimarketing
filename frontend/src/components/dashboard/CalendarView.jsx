import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, List, Grid } from "lucide-react";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar"); // calendar | list

  useEffect(() => {
    try {
      const saved = localStorage.getItem("art-events");
      if (saved) setEvents(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading events:", e);
    }

    // Listen for storage changes
    const handleStorage = () => {
      const saved = localStorage.getItem("art-events");
      if (saved) setEvents(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    return events.filter(e => {
      if (!e.date) return false;
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === year && 
             eventDate.getMonth() === month && 
             eventDate.getDate() === day;
    });
  };

  const upcomingEvents = events
    .filter(e => e.date && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5DF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E7E5DF]">
        <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: "Playfair Display, serif" }}>
          Calendario
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "calendar" ? "bg-[#C8553D] text-white" : "text-[#57534E] hover:bg-[#F5F2EA]"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#C8553D] text-white" : "text-[#57534E] hover:bg-[#F5F2EA]"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 text-[#57534E] hover:text-[#C8553D]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-[#1C1917]">
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1 text-[#57534E] hover:text-[#C8553D]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs text-[#57534E] font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for padding */}
            {[...Array(startPad)].map((_, i) => (
              <div key={`pad-${i}`} className="h-10" />
            ))}
            
            {/* Days */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              
              return (
                <div
                  key={day}
                  className={`h-10 flex flex-col items-center justify-center rounded-lg text-sm relative
                    ${isToday ? "bg-[#C8553D] text-white" : "hover:bg-[#F5F2EA]"}
                  `}
                >
                  <span>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isToday ? "bg-white" : "bg-[#C8553D]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4">
          {upcomingEvents.length === 0 ? (
            <p className="text-[#57534E] text-center py-4">No hay eventos próximos.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 border border-[#E7E5DF] rounded-lg">
                  <div className="w-12 h-12 bg-[#F5F2EA] rounded-lg flex flex-col items-center justify-center text-[#C8553D]">
                    <span className="text-xs font-medium">
                      {new Date(event.date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1C1917] truncate">{event.title}</h4>
                    <p className="text-xs text-[#57534E]">
                      {new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
