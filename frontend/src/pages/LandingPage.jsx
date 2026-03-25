import { Link } from "react-router-dom";
import ChatWidget from "@/components/landing/ChatWidget";
import EventsPreview from "@/components/landing/EventsPreview";
import LizIntroModal from "@/components/LizIntroModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Settings } from "lucide-react";

const DEFAULT_CONTENT = {
  heroTitle: "Descubre tu creatividad en nuestra escuela de arte",
  heroSubtitle: "Explora clases, talleres y experiencias artísticas para todas las edades.",
  leadTitle: "¿Te interesan nuestras clases?",
  leadSubtitle: "Déjanos tus datos y te contactaremos con más información.",
  classTypes: ["Taller de Fin de Semana", "Clase de Prueba Gratis", "Intensivo de Temporada", "Estudio Abierto"]
};

export default function LandingPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadInterest, setLeadInterest] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("art-landing-content");
      if (saved) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const submitLead = (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadInterest) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
      toast.error("Correo inválido");
      return;
    }

    setSubmitting(true);
    try {
      const leads = JSON.parse(localStorage.getItem("art-leads") || "[]");
      leads.push({ name: leadName.trim(), email: leadEmail.trim(), interest: leadInterest, timestamp: new Date().toISOString() });
      localStorage.setItem("art-leads", JSON.stringify(leads));
      toast.success("¡Gracias! Nos pondremos en contacto pronto.");
      setLeadName(""); setLeadEmail(""); setLeadInterest("");
    } catch {
      toast.error("Error al enviar");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917]">
      <Toaster position="top-right" richColors />
      <LizIntroModal />
      
      {/* Admin Link */}
      <Link 
        to="/login" 
        className="fixed top-4 right-4 p-2 text-[#57534E] hover:text-[#C8553D] transition-colors z-40"
        title="Panel de administración"
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold tracking-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {content.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-[#57534E] max-w-2xl">
          {content.heroSubtitle}
        </p>
      </section>

      {/* Courses & Events Preview */}
      <EventsPreview />

      {/* Lead Capture Section */}
      <section className="bg-[#F5F2EA] py-16 md:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {content.leadTitle}
          </h2>
          <p className="text-[#57534E] text-lg mb-10">
            {content.leadSubtitle}
          </p>

          <form onSubmit={submitLead} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Nombre</Label>
                <Input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-2 border-[#E7E5DF] bg-white"
                  data-testid="lead-name"
                />
              </div>
              <div>
                <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Correo</Label>
                <Input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="mt-2 border-[#E7E5DF] bg-white"
                  data-testid="lead-email"
                />
              </div>
            </div>
            <div>
              <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Clase de Interés</Label>
              <Select value={leadInterest} onValueChange={setLeadInterest}>
                <SelectTrigger className="mt-2 border-[#E7E5DF] bg-white" data-testid="lead-interest">
                  <SelectValue placeholder="¿Qué te interesa?" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E7E5DF]">
                  {content.classTypes.map((type, i) => (
                    <SelectItem key={i} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="px-12 bg-[#C8553D] hover:bg-[#A64530] text-white"
                data-testid="lead-submit"
              >
                {submitting ? "Enviando..." : "Contáctanos"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
}
