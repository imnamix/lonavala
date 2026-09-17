import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, sourceLang = "en", targetLang = "mr" } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required for translation" },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // 1. Try Google Translate Single API (GTX)
    try {
      const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sourceLang
      )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(
        trimmedText
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
            return NextResponse.json({
              translatedText: translatedParts,
              sourceLang,
              targetLang,
            });
          }
        }
      }
    } catch (googleError) {
      console.warn("Google translate API failed, trying fallback:", googleError);
    }

    // 2. Fallback to MyMemory Translate API
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        trimmedText
      )}&langpair=${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`;

      const fallbackRes = await fetch(myMemoryUrl);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (
          fallbackData &&
          fallbackData.responseData &&
          fallbackData.responseData.translatedText
        ) {
          return NextResponse.json({
            translatedText: fallbackData.responseData.translatedText,
            sourceLang,
            targetLang,
          });
        }
      }
    } catch (fallbackError) {
      console.warn("Fallback translation API failed:", fallbackError);
    }

    return NextResponse.json(
      { error: "Translation service failed to translate the text." },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
