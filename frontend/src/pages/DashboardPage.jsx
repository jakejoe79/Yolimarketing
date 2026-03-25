import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Megaphone, Calendar, Edit, Home, Download } from "lucide-react";
import AdminGuide from "@/components/shared/AdminGuide";
import CoursesEventsManager from "@/components/dashboard/CoursesEventsManager";
import CalendarView from "@/components/dashboard/CalendarView";

// CSV Export utility
const exportLeadsToCSV = (leads) => {
  if (leads.length === 0) return;
  
  const headers = ["Nombre", "Email", "Interés", "Fuente", "Fecha"];
  const rows = leads.map(lead => [
    lead.name || "",
    lead.email || "",
    lead.interest || "",
    lead.source || "formulario",
    lead.timestamp ? new Date(lead.timestamp).toLocaleDateString("es-ES") : ""
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      setLeads(JSON.parse(localStorage.getItem("art-leads") || "[]"));
      setCourses(JSON.parse(localStorage.getItem("art-courses") || "[]"));
      setEvents(JSON.parse(localStorage.getItem("art-events") || "[]"));
      const savedCampaign = localStorage.getItem("art-campaigns");
      if (savedCampaign) setCampaigns([JSON.parse(savedCampaign)]);
    } catch {}

    // Refresh data when localStorage changes
    const interval = setInterval(() => {
      try {
        setCourses(JSON.parse(localStorage.getItem("art-courses") || "[]"));
        setEvents(JSON.parse(localStorage.getItem("art-events") || "[]"));
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("art-auth");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E5DF] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-[#1C1917]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Panel de Control
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[#57534E] hover:text-[#C8553D]">
              <Home className="w-5 h-5" />
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-[#57534E]">
              <LogOut className="w-5 h-5 mr-2" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C8553D]/10 rounded-lg">
                <Users className="w-6 h-6 text-[#C8553D]" />
              </div>
              <div>
                <p className="text-sm text-[#57534E]">Leads</p>
                <p className="text-3xl font-bold text-[#1C1917]">{leads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C8553D]/10 rounded-lg">
                <Megaphone className="w-6 h-6 text-[#C8553D]" />
              </div>
              <div>
                <p className="text-sm text-[#57534E]">Campañas</p>
                <p className="text-3xl font-bold text-[#1C1917]">{campaigns.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C8553D]/10 rounded-lg">
                <Calendar className="w-6 h-6 text-[#C8553D]" />
              </div>
              <div>
                <p className="text-sm text-[#57534E]">Eventos</p>
                <p className="text-3xl font-bold text-[#1C1917]">{events.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses/Events Manager + Calendar */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <CoursesEventsManager />
          <CalendarView />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Link to="/campaigns" className="block">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF] hover:border-[#C8553D] transition-colors">
              <div className="flex items-center gap-4">
                <Megaphone className="w-8 h-8 text-[#C8553D]" />
                <div>
                  <h3 className="font-bold text-[#1C1917]">Generar Campaña</h3>
                  <p className="text-sm text-[#57534E]">Crea contenido para redes sociales con IA</p>
                </div>
              </div>
            </div>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF] hover:border-[#C8553D] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Edit className="w-8 h-8 text-[#C8553D]" />
              <div>
                <h3 className="font-bold text-[#1C1917]">Editar Landing</h3>
                <p className="text-sm text-[#57534E]">Personaliza textos e imágenes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "Playfair Display, serif" }}>
              Leads Recientes
            </h2>
            {leads.length > 0 && (
              <Button
                onClick={() => exportLeadsToCSV(leads)}
                variant="outline"
                size="sm"
                className="border-[#C8553D] text-[#C8553D] hover:bg-[#C8553D] hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </div>
          {leads.length === 0 ? (
            <p className="text-[#57534E]">Aún no hay leads registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E7E5DF]">
                    <th className="text-left py-3 px-2 text-sm text-[#57534E] font-semibold">Nombre</th>
                    <th className="text-left py-3 px-2 text-sm text-[#57534E] font-semibold">Email</th>
                    <th className="text-left py-3 px-2 text-sm text-[#57534E] font-semibold">Interés</th>
                    <th className="text-left py-3 px-2 text-sm text-[#57534E] font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(-10).reverse().map((lead, i) => (
                    <tr key={i} className="border-b border-[#E7E5DF] last:border-0">
                      <td className="py-3 px-2 text-[#1C1917]">{lead.name}</td>
                      <td className="py-3 px-2 text-[#1C1917]">{lead.email}</td>
                      <td className="py-3 px-2 text-[#1C1917]">{lead.interest}</td>
                      <td className="py-3 px-2 text-[#57534E] text-sm">
                        {new Date(lead.timestamp).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <AdminGuide />
    </div>
  );
}
