"use client";

import type { MediaBranding } from "../lib/media-branding";

type Sponsor = { id:string; sponsor_name:string; logo_path?:string|null; short_detail?:string|null; display_order:number; enabled:boolean; show_logo:boolean; show_detail:boolean };

export default function MediaBrandingPreview({ branding, sponsors = [] }: { branding: MediaBranding; sponsors?: Sponsor[] }) {
  if (!branding.enabled) return null;
  const active = sponsors.filter(s=>s.enabled).sort((a,b)=>a.display_order-b.display_order);
  return (
    <div className="panel" style={{ marginTop: 18 }}>
      <div className="sectionhead">
        <div>
          <h3>Media protection & sponsor branding</h3>
          <p className="muted">Prime sponsor stays in the top-right. Additional sponsors rotate in the footer.</p>
        </div>
        <span className="pill">{active.length} SPONSOR{active.length===1?"":"S"}</span>
      </div>
      <div className="media-brand-preview">
        <div className="media-brand-corner left">talento<span>.</span></div>
        <div className="media-brand-corner right">{branding.sponsor_name || "PRIME SPONSOR"}</div>
        <div className="media-brand-center">
          <strong>USER MEDIA</strong>
          <span>{branding.video_promo_path ? "Sponsor promo configured" : "Sponsor promo can be added later"}</span>
        </div>
        {branding.footer_enabled && active.length > 0 && (
          <div className={"media-sponsor-footer "+branding.sponsor_display_mode}>
            {active.map((s,i)=><div className="media-sponsor-item" key={s.id||i}><b>{s.sponsor_name}</b>{s.show_detail&&s.short_detail?<small>{s.short_detail}</small>:null}</div>)}
          </div>
        )}
        {branding.watermark_enabled && <div className="media-brand-watermark">talento.</div>}
      </div>
      <div className="media-brand-meta">
        <span>Video intro: {branding.video_intro_seconds}s</span>
        <span>Footer mode: {branding.sponsor_display_mode || "moving_strip"}</span>
        <span>Rotation: {branding.sponsor_rotation_seconds || 4}s</span>
        <span>{branding.screen_capture_protection ? "Screen-capture protection planned" : "Screen-capture protection off"}</span>
      </div>
    </div>
  );
}
