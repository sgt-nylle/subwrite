export type DeviceCategory = 'desktop' | 'mobile';

/**
 * Detects whether the user is playing on mobile (smartphone/tablet/touch) or desktop (PC/Mac).
 */
export const detectDeviceType = (): DeviceCategory => {
  if (typeof window === 'undefined') return 'desktop';

  const ua = (navigator.userAgent || navigator.vendor || '').toLowerCase();

  // Explicit mobile user-agent patterns
  const isMobileUA = /android|iphone|ipad|ipod|windows phone|blackberry|mobile|silk|kindle/i.test(ua);

  // iPadOS on iOS 13+ reports as MacIntel with touch support
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  // Viewport width and touch check
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const isNarrowScreen = window.innerWidth <= 768;

  if (isMobileUA || isIPadOS || (hasTouch && isNarrowScreen)) {
    return 'mobile';
  }

  return 'desktop';
};

export const getDeviceLabel = (device?: DeviceCategory): string => {
  return device === 'mobile' ? 'MOBILE' : 'PC / MAC';
};

export const getDeviceIcon = (device?: DeviceCategory): string => {
  return device === 'mobile' ? '📱' : '💻';
};
