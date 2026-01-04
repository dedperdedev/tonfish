// Haptics utility for Telegram WebApp
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
    const haptic = (window as any).Telegram.WebApp.HapticFeedback;
    switch (type) {
      case 'light':
        haptic.impactOccurred('light');
        break;
      case 'medium':
        haptic.impactOccurred('medium');
        break;
      case 'heavy':
        haptic.impactOccurred('heavy');
        break;
      case 'success':
        haptic.notificationOccurred('success');
        break;
      case 'warning':
        haptic.notificationOccurred('warning');
        break;
      case 'error':
        haptic.notificationOccurred('error');
        break;
    }
  }
}

