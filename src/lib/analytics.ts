import posthog from 'posthog-js';

const KEY  = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com';

let ready = false;

export function initAnalytics(): void {
  if (!KEY || ready) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    persistence: 'localStorage',
  });
  ready = true;
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (!ready) return;
  posthog.capture(event, props);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!ready) return;
  posthog.identify(userId, traits);
}

export function resetUser(): void {
  if (!ready) return;
  posthog.reset();
}

export function setAnalyticsEnabled(enabled: boolean): void {
  if (!ready) return;
  if (enabled) posthog.opt_in_capturing();
  else posthog.opt_out_capturing();
}
