import { useEffect, useState } from "react";
import { Sparkles, Heart, Palette, Calendar, MessageCircle, Facebook } from "lucide-react";

export default function LizIntroModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("liz-seen");
    if (!seen) setOpen(true);
  }, []);

  const closeModal = () => {
    localStorage.setItem("liz-seen", "true");
    setOpen(false);
  };

  const features = [
    { icon: Palette, title: "Cursos y Talleres", desc: "Agrega tus clases de arte, talleres de pintura y eventos especiales." },
    { icon: MessageCircle, title: "Chat con IA", desc: "Un asistente que responde preguntas sobre tus clases y captura interesados." },
    { icon: Sparkles, title: "Campañas Automáticas", desc: "Genera contenido para Facebook e Instagram basado en tus cursos." },
    { icon: Calendar, title: "Calendario de Eventos", desc: "Organiza y muestra tus próximos talleres y exposiciones." },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F5F2EA] rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl border border-[#E7E5DF] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8553D]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C8553D]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {step === 0 ? (
          <>
            {/* Welcome screen */}
            <div className="relative z-10">
              <div className="text-6xl mb-4">🎨</div>
              <h2 
                className="text-3xl mb-2 font-bold text-[#1C1917]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                ¡Hola Liz! 
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Heart className="w-5 h-5 text-[#C8553D] fill-[#C8553D]" />
                <span className="text-[#C8553D] font-medium">Un regalo especial para ti</span>
                <Heart className="w-5 h-5 text-[#C8553D] fill-[#C8553D]" />
              </div>
              
              <p className="text-[#57534E] mb-6 text-lg leading-relaxed">
                ¡Bienvenida a la app de tu escuela de arte! La creé pensando en 
                <span className="text-[#C8553D] font-semibold"> nosotros</span> y en todo lo que 
                podemos lograr juntos con tu talento.
              </p>
              
              <p className="text-[#57534E] mb-8">
                Aquí puedes administrar tus cursos, ver quién está interesado, 
                chatear con visitantes automáticamente, y crear campañas de marketing 
                para <span className="text-[#C8553D]">Facebook e Instagram</span> en segundos.
              </p>

              <button
                onClick={() => setStep(1)}
                className="bg-[#C8553D] hover:bg-[#A64530] text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Descubre qué puede hacer ✨
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Features screen */}
            <div className="relative z-10">
              <h3 
                className="text-2xl mb-6 font-bold text-[#1C1917]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Tu nueva herramienta de marketing
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={i}
                      className="bg-white p-4 rounded-xl border border-[#E7E5DF] text-left hover:border-[#C8553D] transition-colors"
                    >
                      <Icon className="w-6 h-6 text-[#C8553D] mb-2" />
                      <h4 className="font-semibold text-[#1C1917] text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-[#57534E]">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>

              <a 
                href="https://www.facebook.com/profile.php?id=61550732505863"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#57534E] hover:text-[#C8553D] mb-6"
              >
                <Facebook className="w-4 h-4" />
                Conectado con tu página de Facebook
              </a>

              <p className="text-[#57534E] mb-6 text-sm">
                💡 <strong>Tip:</strong> Empieza agregando tus cursos en el Panel de Control. 
                Luego el generador de campañas los usará automáticamente.
              </p>

              <button
                onClick={closeModal}
                className="bg-[#C8553D] hover:bg-[#A64530] text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
              >
                ¡Empecemos! 🎨
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
