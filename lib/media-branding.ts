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
};
