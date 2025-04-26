export const safeLocalStorage = {
    getItem: (key: string): string | null => {
      if (typeof window !== 'undefined') {
        try {
          return localStorage.getItem(key);
        } catch (err) {
          console.error(`Failed to get ${key} from localStorage:`, err);
          return null;
        }
      }
      return null;
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, value);
        } catch (err) {
          console.error(`Failed to set ${key} in localStorage:`, err);
        }
      }
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(key);
        } catch (err) {
          console.error(`Failed to remove ${key} from localStorage:`, err);
        }
      }
    },
    clear: () => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
        } catch (err) {
          console.error('Failed to clear localStorage:', err);
        }
      }
    },
  };