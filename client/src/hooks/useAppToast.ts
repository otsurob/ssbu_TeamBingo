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
  const showToast = (options: ToastOptions) => {
    toaster.create({
      closable: true,
      duration: 4000,
      type: 'error',
      ...options,
    });
  };

  const showError = (title: string, description?: string) =>
    showToast({ title, description, type: 'error' });

  const showSuccess = (title: string, description?: string) =>
    showToast({ title, description, type: 'success' });

  return { showToast, showError, showSuccess };
};
