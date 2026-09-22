const CLIENT_CACHE_KEY = "lmc_mr_translation_cache_v1";

// Memory cache for active session
const memoryCache = new Map<string, string>();

// Initialize memory cache from localStorage if available
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(CLIENT_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v === "string") memoryCache.set(k, v);
      });
    }
  } catch {
    // Ignore storage parse errors
  }
}

function persistCache() {
  if (typeof window === "undefined") return;
  try {
    const obj: Record<string, string> = {};
    // Keep max 500 items in cache
    let count = 0;
    for (const [k, v] of memoryCache.entries()) {
      if (count++ > 500) break;
      obj[k] = v;
    }
    localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore storage write errors
  }
}

export function isDevanagari(text: string): boolean {
  if (!text) return false;
  return /[\u0900-\u097F]/.test(text);
}

export function getCachedMarathi(text: string): string | null {
  if (!text || !text.trim()) return "";
  const trimmed = text.trim();
  if (isDevanagari(trimmed)) return trimmed;
  return memoryCache.get(trimmed) || null;
}

export async function translateToMarathi(
  text: string,
  sourceLang: string = "en"
): Promise<string> {
  if (!text || !text.trim()) {
    return "";
  }

  const trimmed = text.trim();

  // If already in Devanagari / Marathi, return as is
  if (isDevanagari(trimmed)) {
    return trimmed;
  }

  // Check cache first
  if (memoryCache.has(trimmed)) {
    return memoryCache.get(trimmed)!;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: trimmed,
        sourceLang,
        targetLang: "mr",
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to translate text");
    }

    const data = await res.json();
    const translated = data.translatedText || trimmed;
    memoryCache.set(trimmed, translated);
    persistCache();
    return translated;
  } catch (error: any) {
    console.warn("translateToMarathi error:", error);
    return trimmed;
  }
}

export async function translateBatchToMarathi(
  texts: string[],
  sourceLang: string = "en"
): Promise<string[]> {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const results: string[] = new Array(texts.length);
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  texts.forEach((txt, idx) => {
    if (!txt || !txt.trim()) {
      results[idx] = txt || "";
      return;
    }
    const trimmed = txt.trim();
    if (isDevanagari(trimmed)) {
      results[idx] = trimmed;
      return;
    }
    if (memoryCache.has(trimmed)) {
      results[idx] = memoryCache.get(trimmed)!;
    } else {
      uncachedIndices.push(idx);
      uncachedTexts.push(trimmed);
    }
  });

  if (uncachedTexts.length === 0) {
    return results;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts: uncachedTexts,
        sourceLang,
        targetLang: "mr",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.translatedTexts)) {
        data.translatedTexts.forEach((translated: string, i: number) => {
          const originalIdx = uncachedIndices[i];
          const originalText = uncachedTexts[i];
          const resolved = translated || originalText;
          results[originalIdx] = resolved;
          memoryCache.set(originalText, resolved);
        });
        persistCache();
        return results;
      }
    }
  } catch (err) {
    console.warn("translateBatchToMarathi API error, falling back to original texts:", err);
  }

  // Fallback for any remaining unassigned indices
  uncachedIndices.forEach((origIdx, i) => {
    if (results[origIdx] === undefined) {
      results[origIdx] = uncachedTexts[i];
    }
  });

  return results;
}

