import { apiFetch } from "./api";

export function sendChatMessage(message, history = []) {
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}
