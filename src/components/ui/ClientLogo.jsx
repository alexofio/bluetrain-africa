import { useState } from "react";

/**
 * Client logo: one-colour by default, real colours on hover. On load it samples the file's pixels to
 * choose a plate for hover: navy behind white-only logos, white behind dark or coloured ones, none for
 * images that already fill their own background. Same-origin (/media) logos only; otherwise white plate.
 */
function plateFor(img) {
  try {
    const w = Math.min(120, img.naturalWidth || 120);
    const h = Math.max(1, Math.round((w * (img.naturalHeight || 60)) / (img.naturalWidth || 120)));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(img, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data;
    let n = 0, lum = 0;
    for (let k = 0; k < d.length; k += 4) {
      if (d[k + 3] < 40) continue;
      n++; lum += d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11;
    }
    if (!n) return "light";
    if (n / (d.length / 4) > 0.9) return "none"; // full-bleed image with its own background
    return lum / n > 200 ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function ClientLogo({ src, alt, className = "" }) {
  const [plate, setPlate] = useState("light");
  return (
    <img
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      data-plate={plate}
      onLoad={(e) => setPlate(plateFor(e.currentTarget))}
      className={`bt-logo ${className}`}
    />
  );
}
