import { useState, useEffect } from "react";

const DEFAULT_CONTENT = {
  hero: {
    title: "Planificador de Campañas",
    subtitle: "Crea la magia del marketing de tu escuela de arte"
  },
  emptyState: {
    title: "Tu lienzo te espera",
    description: "Crea tu primera campaña para ver un hermoso calendario de 7 días diseñado especialmente para tu escuela de arte."
  },
  leadSection: {
    title: "¿Te interesan nuestras clases?",
    description: "Déjanos tus datos y te contactaremos con más información.",
    buttonText: "Contáctanos",
    successMessage: "¡Gracias! Nos pondremos en contacto pronto."
  },
  campaignTypes: [
    { value: "weekend-workshop", label: "Taller de Fin de Semana" },
    { value: "free-trial", label: "Clase de Prueba Gratis" },
    { value: "seasonal-intensive", label: "Intensivo de Temporada" },
    { value: "open-studio", label: "Estudio Abierto" }
  ],
  branding: {
    schoolName: "Escuela de Arte",
    logoUrl: ""
  }
};

export function useEditableContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("art-landing-content");
      if (saved) {
        setContent({ ...DEFAULT_CONTENT, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error("Failed to load content:", e);
    }
  }, []);

  const updateContent = (section, field, value) => {
    setContent(prev => {
      const updated = {
        ...prev,
        [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
          ? { ...prev[section], [field]: value }
          : value
      };
      try {
        localStorage.setItem("art-landing-content", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save content:", e);
      }
      return updated;
    });
  };

  const resetContent = () => {
    setContent(DEFAULT_CONTENT);
    localStorage.removeItem("art-landing-content");
  };

  return { content, updateContent, resetContent, isEditMode, setIsEditMode };
}

export function EditableText({ value, onChange, isEditMode, className = "", as: Component = "span", multiline = false }) {
  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} border-2 border-dashed border-[#C8553D] bg-white/50 p-2 rounded focus:outline-none focus:border-solid min-h-[80px] w-full resize-y`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className} border-2 border-dashed border-[#C8553D] bg-white/50 px-2 rounded focus:outline-none focus:border-solid w-full`}
    />
  );
}

export function EditModeToggle({ isEditMode, setIsEditMode, onReset }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => setIsEditMode(!isEditMode)}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          isEditMode 
            ? "bg-green-600 text-white hover:bg-green-700" 
            : "bg-[#C8553D] text-white hover:bg-[#A64530]"
        }`}
        data-testid="edit-mode-toggle"
      >
        {isEditMode ? "✓ Guardar" : "✎ Editar Página"}
      </button>
      {isEditMode && (
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-500 text-white hover:bg-gray-600"
          data-testid="reset-content-btn"
        >
          Restaurar
        </button>
      )}
    </div>
  );
}

export { DEFAULT_CONTENT };
