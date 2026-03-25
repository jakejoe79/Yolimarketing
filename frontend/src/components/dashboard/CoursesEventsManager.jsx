import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, X, BookOpen, Calendar } from "lucide-react";

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function CoursesEventsManager() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("art-courses");
      const savedEvents = localStorage.getItem("art-events");
      if (savedCourses) setCourses(JSON.parse(savedCourses));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
    } catch (e) {
      console.error("Error loading data:", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("art-courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("art-events", JSON.stringify(events));
  }, [events]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(activeTab === "courses" 
      ? { title: "", description: "", image: "", price: "" }
      : { title: "", description: "", image: "", date: "" }
    );
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (activeTab === "courses") {
      if (editingItem) {
        setCourses(prev => prev.map(c => c.id === editingItem.id ? { ...formData, id: editingItem.id } : c));
      } else {
        setCourses(prev => [...prev, { ...formData, id: generateId() }]);
      }
    } else {
      if (editingItem) {
        setEvents(prev => prev.map(e => e.id === editingItem.id ? { ...formData, id: editingItem.id } : e));
      } else {
        setEvents(prev => [...prev, { ...formData, id: generateId() }]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (activeTab === "courses") {
      setCourses(prev => prev.filter(c => c.id !== id));
    } else {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const items = activeTab === "courses" ? courses : events;

  return (
    <div className="bg-white rounded-xl border border-[#E7E5DF] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#E7E5DF]">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "courses" 
              ? "bg-[#C8553D] text-white" 
              : "text-[#57534E] hover:bg-[#F5F2EA]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Cursos ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "events" 
              ? "bg-[#C8553D] text-white" 
              : "text-[#57534E] hover:bg-[#F5F2EA]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Eventos ({events.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Button 
          onClick={openAddModal}
          className="w-full mb-4 bg-[#C8553D] hover:bg-[#A64530] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar {activeTab === "courses" ? "Curso" : "Evento"}
        </Button>

        {items.length === 0 ? (
          <p className="text-[#57534E] text-center py-8">
            No hay {activeTab === "courses" ? "cursos" : "eventos"} todavía.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 border border-[#E7E5DF] rounded-lg hover:border-[#C8553D] transition-colors"
              >
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#1C1917] truncate">{item.title}</h4>
                  <p className="text-xs text-[#57534E]">
                    {activeTab === "courses" && item.price && `$${item.price}`}
                    {activeTab === "events" && item.date && new Date(item.date).toLocaleDateString('es-ES', { 
                      weekday: 'short', day: 'numeric', month: 'short' 
                    })}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="p-2 text-[#57534E] hover:text-[#C8553D] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-[#57534E] hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1C1917]" style={{ fontFamily: "Playfair Display, serif" }}>
                {editingItem ? "Editar" : "Agregar"} {activeTab === "courses" ? "Curso" : "Evento"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#57534E] hover:text-[#1C1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[#57534E] text-xs uppercase tracking-wider font-semibold">Título</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={activeTab === "courses" ? "Taller de Acuarela" : "Exposición de Fin de Año"}
                  className="mt-1 border-[#E7E5DF]"
                />
              </div>

              <div>
                <Label className="text-[#57534E] text-xs uppercase tracking-wider font-semibold">Descripción</Label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe brevemente..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-[#E7E5DF] rounded-lg text-sm focus:outline-none focus:border-[#C8553D]"
                />
              </div>

              <div>
                <Label className="text-[#57534E] text-xs uppercase tracking-wider font-semibold">URL de Imagen</Label>
                <Input
                  value={formData.image || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1 border-[#E7E5DF]"
                />
              </div>

              {activeTab === "courses" ? (
                <div>
                  <Label className="text-[#57534E] text-xs uppercase tracking-wider font-semibold">Precio (USD)</Label>
                  <Input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="99"
                    className="mt-1 border-[#E7E5DF]"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-[#57534E] text-xs uppercase tracking-wider font-semibold">Fecha y Hora</Label>
                  <Input
                    type="datetime-local"
                    value={formData.date || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-1 border-[#E7E5DF]"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-[#E7E5DF]"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  className="flex-1 bg-[#C8553D] hover:bg-[#A64530] text-white"
                >
                  {editingItem ? "Guardar" : "Agregar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
