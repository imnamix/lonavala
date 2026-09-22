import { NextResponse } from "next/server";

// In-memory server cache for fast repeated translations
const translationCache = new Map<string, string>();

async function translateSingle(
  text: string,
  sourceLang: string = "en",
  targetLang: string = "mr"
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Check if text is already in Devanagari script (Marathi/Hindi)
  if (targetLang === "mr" && /[\u0900-\u097F]/.test(trimmed)) {
    return trimmed;
  }

  const cacheKey = `${sourceLang}_${targetLang}_${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // 1. Try Google Translate Single API (GTX)
  try {
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sourceLang
    )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;

    const response = await fetch(googleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data[0])) {
        const translatedParts = data[0]
          .map((chunk: any) => (chunk && chunk[0] ? chunk[0] : ""))
          .join("");

        if (translatedParts.trim()) {
          translationCache.set(cacheKey, translatedParts);
          return translatedParts;
        }
      }
    }
  } catch (googleError) {
    console.warn("Google translate API failed, trying fallback:", googleError);
  }

  // 2. Fallback to MyMemory Translate API
  try {
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`;

    const fallbackRes = await fetch(myMemoryUrl);
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (
        fallbackData &&
        fallbackData.responseData &&
        fallbackData.responseData.translatedText
      ) {
        const translated = fallbackData.responseData.translatedText;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (fallbackError) {
    console.warn("Fallback translation API failed:", fallbackError);
  }

  // Return original text if both fail
  return text;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, texts, sourceLang = "en", targetLang = "mr" } = body;

    // Handle batch translation
    if (Array.isArray(texts)) {
      const translatedTexts = await Promise.all(
        texts.map(async (t) => {
          if (!t || typeof t !== "string" || !t.trim()) return t || "";
          return translateSingle(t, sourceLang, targetLang);
        })
      );

      return NextResponse.json({
        translatedTexts,
        sourceLang,
        targetLang,
      });
    }

    // Handle single translation
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required for translation" },
        { status: 400 }
      );
    }

    const translatedText = await translateSingle(text, sourceLang, targetLang);

    return NextResponse.json({
      translatedText,
      sourceLang,
      targetLang,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

