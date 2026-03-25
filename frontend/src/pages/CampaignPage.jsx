import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { generateCampaign } from "@/services/campaigns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast, Toaster } from "sonner";
import { Calendar as CalendarIcon, Copy, Check, Sparkles, Clock, Hash, Loader2, Instagram, Facebook, Home, ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminGuide from "@/components/shared/AdminGuide";

const CAMPAIGN_TYPES = [
  { value: "weekend-workshop", label: "Taller de Fin de Semana" },
  { value: "free-trial", label: "Clase de Prueba Gratis" },
  { value: "seasonal-intensive", label: "Intensivo de Temporada" },
  { value: "open-studio", label: "Estudio Abierto" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )},
  { id: "facebook", label: "Facebook", icon: Facebook },
];

function DayCard({ day, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${day.caption}\n\n${day.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("¡Copiado!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-[#E7E5DF] rounded-xl p-6 hover:border-[#C8553D] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: "Playfair Display, serif" }}>{day.day}</h3>
          <div className="flex items-center gap-2 text-[#57534E] mt-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{day.postTime}</span>
          </div>
        </div>
      </div>
      <p className="text-[#1C1917] leading-relaxed mb-4 text-sm">{day.caption}</p>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-4 h-4 text-[#57534E]" />
          <span className="text-xs text-[#57534E] uppercase tracking-wider font-semibold">Hashtags</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {day.hashtags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-[#F5F2EA] text-[#57534E] px-2 py-1 rounded-full">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={handleCopy}
        className={cn(
          "text-sm px-4 py-2 rounded-lg border transition-colors flex items-center gap-2",
          copied ? "bg-green-600 text-white border-green-600" : "border-[#E7E5DF] text-[#57534E] hover:border-[#C8553D] hover:text-[#C8553D]"
        )}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "¡Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

export default function CampaignPage() {
  const [budget, setBudget] = useState([100]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [campaignType, setCampaignType] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  // Load courses and events from localStorage
  useEffect(() => {
    try {
      const savedCourses = JSON.parse(localStorage.getItem("art-courses") || "[]");
      const savedEvents = JSON.parse(localStorage.getItem("art-events") || "[]");
      setCourses(savedCourses);
      setEvents(savedEvents);
    } catch (e) {
      console.error("Error loading courses/events:", e);
    }
  }, []);

  const isFormValid = budget[0] >= 20 && dateRange.from && dateRange.to && campaignType && platforms.length > 0;

  const togglePlatform = (id) => setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setError("");

    try {
      const data = await generateCampaign({
        budget: budget[0],
        dateRange: { start: format(dateRange.from, "yyyy-MM-dd"), end: format(dateRange.to, "yyyy-MM-dd") },
        campaignType: CAMPAIGN_TYPES.find(t => t.value === campaignType)?.label || campaignType,
        platforms,
        campaignContext: { courses, events }  // Include courses/events context
      });

      const campaignData = { ...data, timestamp: new Date().toISOString() };
      localStorage.setItem("art-campaigns", JSON.stringify(campaignData));
      setCampaign(campaignData);
      toast.success("¡Campaña generada!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasContext = courses.length > 0 || events.length > 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white border-b border-[#E7E5DF] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[#57534E] hover:text-[#C8553D]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#1C1917]" style={{ fontFamily: "Playfair Display, serif" }}>
              Generar Campaña
            </h1>
          </div>
          <Link to="/" className="text-[#57534E] hover:text-[#C8553D]">
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5DF] h-fit">
            <div className="space-y-6">
              <div>
                <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Presupuesto</Label>
                <div className="mt-3 px-1">
                  <Slider value={budget} onValueChange={setBudget} min={20} max={500} step={10} />
                  <div className="flex justify-between mt-2 text-sm text-[#57534E]">
                    <span>$20</span>
                    <span className="font-semibold text-[#C8553D]">${budget[0]}</span>
                    <span>$500</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Fechas</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal border-[#E7E5DF]", !dateRange.from && "text-[#57534E]")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#C8553D]" />
                        {dateRange.from ? format(dateRange.from, "d MMM") : "Inicio"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar mode="single" selected={dateRange.from} onSelect={(d) => setDateRange(p => ({ ...p, from: d }))} disabled={(d) => d < new Date()} />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal border-[#E7E5DF]", !dateRange.to && "text-[#57534E]")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#C8553D]" />
                        {dateRange.to ? format(dateRange.to, "d MMM") : "Fin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar mode="single" selected={dateRange.to} onSelect={(d) => setDateRange(p => ({ ...p, to: d }))} disabled={(d) => d < (dateRange.from || new Date())} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Tipo</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger className="mt-3 border-[#E7E5DF]"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent className="bg-white">{CAMPAIGN_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold">Plataformas</Label>
                <div className="space-y-2 mt-3">
                  {PLATFORMS.map(p => {
                    const Icon = p.icon;
                    return (
                      <label key={p.id} className={cn("flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors", platforms.includes(p.id) ? "border-[#C8553D] bg-[#C8553D]/5" : "border-[#E7E5DF]")}>
                        <Checkbox checked={platforms.includes(p.id)} onCheckedChange={() => togglePlatform(p.id)} className="data-[state=checked]:bg-[#C8553D] data-[state=checked]:border-[#C8553D]" />
                        <Icon className="w-5 h-5 text-[#57534E]" />
                        <span className="text-[#1C1917]">{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Context Preview */}
              {hasContext && (
                <div className="p-3 bg-[#F5F2EA] rounded-lg">
                  <Label className="text-[#57534E] uppercase tracking-wider text-xs font-semibold mb-2 block">Contexto Incluido</Label>
                  <div className="space-y-1 text-sm">
                    {courses.length > 0 && (
                      <div className="flex items-center gap-2 text-[#1C1917]">
                        <BookOpen className="w-4 h-4 text-[#C8553D]" />
                        <span>{courses.length} curso{courses.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {events.length > 0 && (
                      <div className="flex items-center gap-2 text-[#1C1917]">
                        <CalendarDays className="w-4 h-4 text-[#C8553D]" />
                        <span>{events.length} evento{events.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#57534E] mt-2">La IA usará estos datos para personalizar el contenido.</p>
                </div>
              )}

              <Button onClick={handleGenerate} disabled={!isFormValid || isLoading} className="w-full bg-[#C8553D] hover:bg-[#A64530] text-white">
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Generando...</> : <><Sparkles className="w-5 h-5 mr-2" />Generar Campaña</>}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">{error}</div>}
            
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-[#E7E5DF] rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-[#F5F2EA] rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-[#F5F2EA] rounded w-full mb-2"></div>
                    <div className="h-4 bg-[#F5F2EA] rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && campaign?.schedule && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#1C1917]" style={{ fontFamily: "Playfair Display, serif" }}>Tu Campaña de 7 Días</h2>
                  <p className="text-[#57534E]">{campaign.type} · ${campaign.budget} · {campaign.platforms?.join(", ")}</p>
                </div>
                <div className="grid gap-4">
                  {campaign.schedule.map((day, i) => <DayCard key={i} day={day} index={i} />)}
                </div>
              </div>
            )}

            {!isLoading && !campaign && !error && (
              <div className="bg-white border border-[#E7E5DF] rounded-xl p-12 text-center">
                <Sparkles className="w-12 h-12 text-[#C8553D] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1C1917] mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Crea tu campaña
                </h3>
                <p className="text-[#57534E]">Completa el formulario para generar contenido con IA.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <AdminGuide />
    </div>
  );
}
