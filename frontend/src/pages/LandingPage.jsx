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

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#E7E5DF]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#57534E] text-sm">
            © 2026 Escuela de Arte. Todos los derechos reservados.
          </p>
          <a 
            href="https://www.facebook.com/profile.php?id=61550732505863"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#57534E] hover:text-[#C8553D] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Síguenos en Facebook
          </a>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
