"use client";

import type { MediaBranding } from "../lib/media-branding";

export default function MediaBrandingPreview({ branding }: { branding: MediaBranding }) {
  if (!branding.enabled) return null;
  return (
    <div className="panel" style={{ marginTop: 18 }}>
      <div className="sectionhead">
        <div>
          <h3>Media protection & branding</h3>
          <p className="muted">Every competition entry can carry Talento and sponsor branding.</p>
        </div>
        <span className="pill">READY</span>
      </div>
      <div className="media-brand-preview">
        <div className="media-brand-corner left">talento<span>.</span></div>
        <div className="media-brand-corner right">{branding.sponsor_name || "SPONSOR"}</div>
        <div className="media-brand-center">
          <strong>USER MEDIA</strong>
          <span>{branding.video_promo_path ? "Sponsor promo configured" : "Sponsor promo can be added later"}</span>
        </div>
        {branding.watermark_enabled && <div className="media-brand-watermark">talento.</div>}
      </div>
      <div className="media-brand-meta">
        <span>Video intro: {branding.video_intro_seconds}s</span>
        <span>Voice intro: {branding.voice_intro_seconds}s</span>
        <span>{branding.screen_capture_protection ? "Screen-capture protection planned" : "Screen-capture protection off"}</span>
      </div>
    </div>
  );
}
