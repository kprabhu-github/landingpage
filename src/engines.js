/* Official AI engine logos from src/assets/engines/ (chatgpt, gemini, perplexity, google-ai). */
const FILES = import.meta.glob("./assets/engines/*.{svg,png,webp,jpg}", { eager: true, query: "?url", import: "default" });
export const engineLogo = (id) => {
  const hit = Object.entries(FILES).find(([p]) => p.split("/").pop().split(".")[0].toLowerCase() === id);
  return hit ? hit[1] : null;
};
