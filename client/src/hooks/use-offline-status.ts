import { useState, useEffect } from 'react';

export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('Connection restored - syncing data...');
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('Connection lost - operating in offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}
