import { useOfflineStatus } from "@/hooks/use-offline-status";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const isOffline = useOfflineStatus();

  return (
    <div 
      className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-md text-white text-sm font-medium flex items-center space-x-2 ${
        isOffline ? 'bg-orange-500' : 'bg-green-500'
      }`}
      data-testid="offline-indicator"
    >
      {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
      <span data-testid="text-connection-status">{isOffline ? 'Offline' : 'Online'}</span>
    </div>
  );
}
