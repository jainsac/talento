export type MediaBranding = {
  enabled: boolean;
  sponsor_name: string | null;
  sponsor_logo_path: string | null;
  video_promo_path: string | null;
  voice_intro_path: string | null;
  photo_footer: string | null;
  video_intro_seconds: number;
  voice_intro_seconds: number;
  watermark_enabled: boolean;
  screen_capture_protection: boolean;
  sponsor_display_mode: "moving_strip" | "slideshow" | "fade" | "grid";
  sponsor_rotation_seconds: number;
  footer_enabled: boolean;
};

export const DEFAULT_MEDIA_BRANDING: MediaBranding = {
  enabled: true,
  sponsor_name: null,
  sponsor_logo_path: null,
  video_promo_path: null,
  voice_intro_path: null,
  photo_footer: "Powered by TALENTO",
  video_intro_seconds: 5,
  voice_intro_seconds: 3,
  watermark_enabled: true,
  screen_capture_protection: true,
  sponsor_display_mode: "moving_strip",
  sponsor_rotation_seconds: 4,
  footer_enabled: true,
};
