import { useState } from "react";
import { HelpCircle, X, ChevronRight } from "lucide-react";

const GUIDE_STEPS = [
  {
    id: "welcome",
    title: "¡Bienvenido a tu Panel!",
    message: "Soy tu asistente y te ayudaré a sacar el máximo provecho de tu app de marketing. ¿Por dónde quieres empezar?",
    options: [
      { label: "📊 Ver mis leads", next: "leads" },
      { label: "🎨 Generar campaña", next: "campaign" },
      { label: "✏️ Editar landing", next: "landing" },
      { label: "💬 Configurar chat", next: "chat" },
      { label: "📚 Ver todo", next: "overview" },
    ]
  },
  {
    id: "leads",
    title: "Gestión de Leads",
    message: `**Tus leads** aparecen en la tabla del Dashboard. Cada lead incluye:
    
• **Nombre** y **correo** del interesado
• **Clase de interés** que seleccionaron
• **Fecha** de registro
• **Fuente** (formulario o chat)

**Tips:**
- Los leads se guardan automáticamente cuando alguien completa el formulario o da sus datos en el chat
- Exporta tus leads copiando desde localStorage: \`localStorage.getItem("art-leads")\`
- En el futuro podrás exportar a CSV o conectar con tu CRM`,
    options: [
      { label: "← Volver al inicio", next: "welcome" },
      { label: "Siguiente: Campañas →", next: "campaign" },
    ]
  },
  {
    id: "campaign",
    title: "Generador de Campañas con IA",
    message: `**Crea contenido para 7 días** de redes sociales con IA:

1. Ve a **Campañas** desde el Dashboard
2. Configura tu campaña:
   - **Presupuesto**: $20-$500
   - **Fechas**: inicio y fin de campaña
   - **Tipo**: Taller, Clase Prueba, Intensivo, Estudio Abierto
   - **Plataformas**: Instagram, TikTok, Facebook

3. Click en **"Generar Campaña"**
4. La IA creará 7 posts con:
   - Horario óptimo de publicación
   - Caption de 150-200 palabras
   - 8-12 hashtags relevantes

5. Usa **"Copiar"** para llevar el contenido a tus redes

**Tip:** El contenido generado se guarda y el chat puede referenciarlo.`,
    options: [
      { label: "← Volver al inicio", next: "welcome" },
      { label: "Siguiente: Landing →", next: "landing" },
    ]
  },
  {
    id: "landing",
    title: "Editar tu Landing Page",
    message: `**Personaliza tu página** sin tocar código:

**Textos editables:**
- Título principal (hero)
- Subtítulo descriptivo
- Sección de leads
- Tipos de clases disponibles

**Cómo editar:**
1. Ve a la Landing (página principal)
2. Los textos se pueden personalizar desde el código o próximamente con el botón "Editar"
3. Los cambios se guardan en \`localStorage["art-landing-content"]\`

**Próximamente:**
- Editor visual inline
- Subir imágenes propias
- Cambiar colores del tema`,
    options: [
      { label: "← Volver al inicio", next: "welcome" },
      { label: "Siguiente: Chat →", next: "chat" },
    ]
  },
  {
    id: "chat",
    title: "Chat con IA para Visitantes",
    message: `**Tu asistente virtual** atiende visitantes 24/7:

**Qué hace el chat:**
- Responde preguntas sobre clases
- Captura leads automáticamente (nombre + correo)
- Usa contexto de campañas activas
- Todo en español

**Captura de leads por chat:**
Cuando un visitante dice algo como:
*"Me llamo Ana, mi correo es ana@email.com y me interesa el taller"*

El chat:
1. Extrae los datos automáticamente
2. Los guarda en \`art-leads\`
3. Responde confirmando el interés

**Tips:**
- El historial se guarda en \`art-chat\`
- Los visitantes pueden limpiar su chat
- Tú ves todos los leads en el Dashboard`,
    options: [
      { label: "← Volver al inicio", next: "welcome" },
      { label: "Ver resumen completo", next: "overview" },
    ]
  },
  {
    id: "overview",
    title: "Resumen de Funcionalidades",
    message: `**Tu app incluye:**

📊 **Dashboard**
- Ver leads capturados
- Estadísticas rápidas
- Accesos directos

🎨 **Generador de Campañas**
- IA genera 7 días de contenido
- Captions + hashtags
- Copiar y pegar a redes

🏠 **Landing Page**
- Captura de leads
- Información de clases
- Chat integrado

💬 **Chat IA**
- Atención 24/7
- Captura automática de leads
- Contexto de campañas

🔐 **Área Admin**
- Protegida con contraseña
- Contraseña por defecto: admin123
- Cámbiala en producción

**¿Necesitas ayuda con algo específico?**`,
    options: [
      { label: "← Volver al inicio", next: "welcome" },
      { label: "Ver leads", next: "leads" },
      { label: "Generar campaña", next: "campaign" },
    ]
  },
];

export default function AdminGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("welcome");
  
  const step = GUIDE_STEPS.find(s => s.id === currentStep) || GUIDE_STEPS[0];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-[#1C1917] text-white shadow-lg hover:bg-[#57534E] transition-all flex items-center justify-center"
        title="Guía de usuario"
        data-testid="admin-guide-toggle"
      >
        {isOpen ? <X className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
      </button>

      {/* Guide Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 w-80 md:w-96 max-h-[70vh] bg-white border border-[#E7E5DF] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#1C1917] text-white p-4">
            <h3 className="font-bold text-lg" style={{ fontFamily: "Playfair Display, serif" }}>
              {step.title}
            </h3>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="prose prose-sm text-[#1C1917]">
              {step.message.split('\n').map((line, i) => {
                // Handle bold text
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={i} className="mb-2 text-sm leading-relaxed">
                    {parts.map((part, j) => 
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="p-3 border-t border-[#E7E5DF] space-y-2">
            {step.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(option.next)}
                className="w-full text-left px-4 py-2.5 rounded-lg border border-[#E7E5DF] hover:border-[#C8553D] hover:bg-[#FDFBF7] transition-colors flex items-center justify-between text-sm text-[#1C1917]"
              >
                <span>{option.label}</span>
                <ChevronRight className="w-4 h-4 text-[#57534E]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
