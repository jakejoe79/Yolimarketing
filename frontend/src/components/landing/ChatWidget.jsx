import { useEffect, useState } from "react";
import { sendChatMessage } from "@/services/chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("art-chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading art-chat", e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("art-chat", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    const userMessage = { role: "user", message: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Get campaign context if available
    let campaignContext = null;
    try {
      const campaigns = localStorage.getItem("art-campaigns");
      if (campaigns) {
        campaignContext = JSON.parse(campaigns);
      }
    } catch (e) {
      console.error("Error reading art-campaigns", e);
    }

    try {
      const data = await sendChatMessage({
        message: userInput,
        history: messages,
        campaignContext,
      });

      const aiMessage = {
        role: "ai",
        message: data.reply || "¡Gracias por tu mensaje!",
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Handle lead collection action
      if (data.action === "collect_lead" && data.leadData) {
        const leads = JSON.parse(localStorage.getItem("art-leads") || "[]");
        localStorage.setItem(
          "art-leads",
          JSON.stringify([...leads, { ...data.leadData, timestamp: new Date().toISOString(), source: "chat" }])
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", message: "Lo siento, algo salió mal. Por favor intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("art-chat");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full bg-[#C8553D] text-white shadow-lg hover:scale-105 hover:bg-[#A64530] transition-all flex items-center justify-center text-2xl"
          aria-label="Abrir chat"
          data-testid="chat-open-btn"
        >
          💬
        </button>
      )}

      {open && (
        <div className="w-80 md:w-96 h-[28rem] rounded-2xl shadow-2xl border border-[#E7E5DF] bg-[#FDFBF7] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#C8553D] text-white">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Asistente de Arte
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-white/70 text-xs hover:text-white"
                title="Limpiar chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg hover:opacity-80"
                aria-label="Cerrar chat"
                data-testid="chat-close-btn"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-[#57534E] bg-white p-3 rounded-xl border border-[#E7E5DF]">
                ¡Hola! 👋 Soy tu asistente de la escuela de arte. ¿Te gustaría información sobre nuestras clases o reservar una clase de prueba gratis?
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-[#C8553D] text-white rounded-br-md"
                    : "mr-auto bg-white text-[#1C1917] border border-[#E7E5DF] rounded-bl-md"
                }`}
              >
                {m.message}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-white text-[#57534E] border border-[#E7E5DF] max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#E7E5DF] bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 rounded-lg border border-[#E7E5DF] px-3 py-2.5 bg-[#FDFBF7] text-sm outline-none focus:border-[#C8553D] focus:ring-1 focus:ring-[#C8553D]/20"
              data-testid="chat-input"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-[#C8553D] hover:bg-[#A64530] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              data-testid="chat-send-btn"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
