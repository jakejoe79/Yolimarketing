import { apiFetch } from "./api";

export function sendChatMessage(payload) {
  // payload: { message, history, campaignContext }
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
