/**
 * Direct file download helper that triggers browser downloads directly into
 * the user's Downloads tray without opening an extra tab or navigating away.
 * Never uses iframes (which cause "This content is blocked" browser security errors).
 */
export async function triggerDirectDownload(url: string, filename?: string): Promise<void> {
  if (!url || typeof window === "undefined") return;

  // For interactive web editor services (Canva / CapCut web), open in a new tab to edit
  if (url.includes("canva.com") || url.includes("capcut.com/template")) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const safeFilename = filename || "download";

  // 1. Try background blob fetch for same-origin or CORS-enabled endpoints
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
        try {
          document.body.removeChild(a);
        } catch {}
      }, 1500);
      return;
    }
  } catch {
    // If fetch throws (e.g. cross-origin blocking on redirect), proceed to native anchor dispatch
  }

  // 2. Clean anchor dispatch with download attribute (No iframes)
  try {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = safeFilename;
    a.target = "_self";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {}
    }, 1000);
  } catch {
    // 3. Fallback: window assign for attachment endpoints
    window.location.assign(url);
  }
}

