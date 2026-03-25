import { apiFetch } from "./api";

export function generateCampaign(payload) {
  return apiFetch("/api/generate-campaign", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
