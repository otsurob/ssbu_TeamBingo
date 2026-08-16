import { useCallback, useMemo } from 'react';
import { toaster } from '../components/ui/toaster';

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'loading';

type ToastOptions = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  closable?: boolean;
  // その他のオプションが必要になったらここに追加
  action?: {
    label: string;
    onClick: () => void;
  };
};

/**
 * Project-wide toast helper.
 * Provides a single entry point to show toasts with sensible defaults.
 */
export const useAppToast = () => {
  const showToast = useCallback((options: ToastOptions) => {
    toaster.create({
      closable: true,
      duration: 4000,
      type: 'error',
      ...options,
    });
  }, []);

  const showError = useCallback(
    (title: string, description?: string) => showToast({ title, description, type: 'error' }),
    [showToast],
  );

  const showSuccess = useCallback(
    (title: string, description?: string) => showToast({ title, description, type: 'success' }),
    [showToast],
  );

  return useMemo(
    () => ({ showToast, showError, showSuccess }),
    [showToast, showError, showSuccess],
  );
};
