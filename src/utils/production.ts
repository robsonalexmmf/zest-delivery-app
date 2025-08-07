// Utilities for production optimization

export const isProduction = () => {
  return import.meta.env.PROD;
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Logger que só funciona em desenvolvimento
export const devLog = (message: string, ...args: any[]) => {
  if (isDevelopment()) {
    console.log(`[DEV] ${message}`, ...args);
  }
};

export const devError = (message: string, error?: any) => {
  if (isDevelopment()) {
    console.error(`[DEV ERROR] ${message}`, error);
  }
};

export const devWarn = (message: string, ...args: any[]) => {
  if (isDevelopment()) {
    console.warn(`[DEV WARNING] ${message}`, ...args);
  }
};

// Cache para otimização
export const createCache = <T>(key: string) => {
  const get = (): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const set = (data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Falha silenciosa
    }
  };

  const remove = (): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Falha silenciosa
    }
  };

  return { get, set, remove };
};

// Debounce para otimizar performance
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Verificação de capacidades do browser
export const checkBrowserSupport = () => {
  const support = {
    localStorage: typeof Storage !== 'undefined',
    clipboard: navigator.clipboard !== undefined,
    serviceWorker: 'serviceWorker' in navigator,
    webp: false
  };

  // Verificar suporte a WebP
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  support.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

  return support;
};