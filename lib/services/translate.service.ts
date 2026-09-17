export async function translateToMarathi(
  text: string,
  sourceLang: string = "en"
): Promise<string> {
  if (!text || !text.trim()) {
    return "";
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        sourceLang,
        targetLang: "mr",
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to translate text");
    }

    const data = await res.json();
    return data.translatedText || "";
  } catch (error: any) {
    console.error("translateToMarathi error:", error);
    throw error;
  }
}
