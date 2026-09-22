import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns a viewer URL for documents (PDF, DOCX, DOC, XLS) so they can be viewed
 * online in a browser tab without forced downloading or server errors.
 */
export function getInlineFileUrl(fileUrl?: string): string {
  if (!fileUrl) return "";

  if (fileUrl.startsWith("data:") || fileUrl.startsWith("blob:")) {
    return fileUrl;
  }

  let url = fileUrl.trim();
  url = url.replace(/\/fl_inline\/?/, "/");
  url = url.replace(/\/fl_attachment:[^/]+/, "");
  url = url.replace(/\/fl_attachment\/?/, "/");

  const cleanUrl = url.split("?")[0].toLowerCase();
  const isDocument =
    cleanUrl.endsWith(".doc") ||
    cleanUrl.endsWith(".docx") ||
    cleanUrl.endsWith(".xls") ||
    cleanUrl.endsWith(".xlsx") ||
    cleanUrl.endsWith(".ppt") ||
    cleanUrl.endsWith(".pptx") ||
    cleanUrl.endsWith(".pdf");

  // For documents (PDF, Word DOCX, etc.), Google Docs Viewer provides reliable online reading in a browser tab
  if (isDocument && (url.startsWith("http://") || url.startsWith("https://"))) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/**
 * Returns a document viewer URL suitable for embedding in iframes
 */
export function getDocumentViewerUrl(fileUrl?: string): string {
  if (!fileUrl) return "";

  if (fileUrl.startsWith("data:") || fileUrl.startsWith("blob:")) {
    return fileUrl;
  }

  let url = fileUrl.trim();
  url = url.replace(/\/fl_inline\/?/, "/");
  url = url.replace(/\/fl_attachment:[^/]+/, "");
  url = url.replace(/\/fl_attachment\/?/, "/");

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return url;
}
