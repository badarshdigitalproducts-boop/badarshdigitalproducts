/**
 * Direct file download helper that triggers browser downloads directly into
 * the user's Downloads tray without opening an extra tab or navigating away.
 */
export async function triggerDirectDownload(url: string, filename?: string): Promise<void> {
  if (!url || typeof window === "undefined") return;

  // For interactive web editor services (Canva / CapCut), open in a new tab to edit
  if (url.includes("canva.com") || url.includes("capcut.com/template")) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const safeFilename = filename || "download";

  // Try background blob fetch for same-origin or CORS-enabled endpoints
  try {
    const res = await fetch(url, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 1000);
      return;
    }
  } catch {
    // If fetch fails (e.g. cross-origin blocking), fall through to hidden iframe / direct anchor
  }

  // Fallback: hidden iframe triggers download without opening a new tab or leaving the page
  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
    }, 15000);
  } catch {
    // Ultimate fallback: direct anchor with download attribute
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = safeFilename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {}
    }, 500);
  }
}
