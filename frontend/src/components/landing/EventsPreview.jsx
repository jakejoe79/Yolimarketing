import { useState, useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";

export default function EventsPreview() {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("art-events");
      const savedCourses = localStorage.getItem("art-courses");
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    } catch (e) {
      console.error("Error loading data:", e);
    }

    // Listen for storage changes
    const handleStorage = () => {
      const savedEvents = localStorage.getItem("art-events");
      const savedCourses = localStorage.getItem("art-courses");
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const upcomingEvents = events
    .filter(e => e.date && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const hasContent = courses.length > 0 || upcomingEvents.length > 0;

  if (!hasContent) {
    return (
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 
          className="text-2xl md:text-3xl mb-6 font-bold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Próximas clases y eventos
        </h2>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E7E5DF]">
          <p className="text-[#57534E]">Aún no hay clases o eventos publicados.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      {/* Courses */}
      {courses.length > 0 && (
        <div className="mb-12">
          <h2 
            className="text-2xl md:text-3xl mb-6 font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Nuestros Cursos
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map(course => (
              <div 
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-[#E7E5DF] overflow-hidden hover:border-[#C8553D] transition-colors group"
              >
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-[#F5F2EA] flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-[#1C1917] mb-2 group-hover:text-[#C8553D] transition-colors">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-sm text-[#57534E] line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {course.price && (
                      <span className="text-lg font-bold text-[#C8553D]">
                        ${course.price}
                      </span>
                    )}
                    <span className="text-sm text-[#C8553D] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver más <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 
            className="text-2xl md:text-3xl mb-6 font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Próximos Eventos
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-[#E7E5DF] hover:border-[#C8553D] transition-colors flex gap-4"
              >
                <div className="w-16 h-16 bg-[#C8553D] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                  <span className="text-xs font-medium uppercase">
                    {new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1C1917] mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-[#57534E] line-clamp-1 mb-2">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[#57534E]">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                {event.image && (
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover hidden sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
