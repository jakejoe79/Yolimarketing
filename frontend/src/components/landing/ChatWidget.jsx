import React, { useState } from "react";
import { sendChatMessage } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input, messages);
      const botMsg = { sender: "bot", text: response.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { sender: "bot", text: "Error en la comunicación. Intenta de nuevo." };
      setMessages(prev => [...prev, botMsg]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#C8553D] hover:bg-[#A64530] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-50"
        data-testid="chat-toggle-btn"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white border border-[#E7E5DF] rounded-xl shadow-2xl z-50 flex flex-col" data-testid="chat-widget">
          <div className="bg-[#C8553D] text-white p-4 rounded-t-xl">
            <h3 className="font-display font-bold text-lg">Asistente de Arte</h3>
            <p className="text-sm opacity-90">¿En qué puedo ayudarte?</p>
          </div>

          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
            {messages.length === 0 && (
              <p className="text-[#57534E] text-sm text-center mt-8">
                ¡Hola! Pregúntame sobre nuestras clases de arte.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg text-sm",
                  m.sender === "user"
                    ? "ml-auto bg-[#C8553D] text-white rounded-br-none"
                    : "mr-auto bg-white border border-[#E7E5DF] text-[#1C1917] rounded-bl-none"
                )}
              >
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-white border border-[#E7E5DF] p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#C8553D] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-[#C8553D] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-[#C8553D] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#E7E5DF] flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border-[#E7E5DF] bg-white"
              data-testid="chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-[#C8553D] hover:bg-[#A64530] text-white"
              data-testid="chat-send-btn"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
