const API_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (typeof import !== 'undefined' && import.meta && import.meta.env ? import.meta.env.VITE_BACKEND_URL : undefined) ||
  process.env.VITE_BACKEND_URL ||
  "https://yolimarketing-backend.onrender.com";

export async function sendMessage(userInput, history = []) {
  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userInput,
        history: history
      })
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json();
    // data = { reply: "...", action: "..." }
    return data;
  } catch (err) {
    console.error("Error sending message:", err);
    return { reply: "Error en la comunicación con el servidor.", action: "error" };
  }
}
