import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { useConnection } from './ConnectionContext';
import type { RoomSnapshot } from '../types/room';

interface RoomContextValue {
  snapshot: RoomSnapshot | null;
  playerId: string | null;
  isWatching: boolean;
  setPlayerId: (id: string | null) => void;
  clearRoom: () => void;
}

const RoomContext = createContext<RoomContextValue>({
  snapshot: null,
  playerId: null,
  isWatching: false,
  setPlayerId: () => {},
  clearRoom: () => {},
});

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { connection, connected } = useConnection();
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [playerId, setPlayerIdState] = useState<string | null>(
    () => localStorage.getItem('playerId')
  );
  const reconnectAttempted = useRef(false);

  const setPlayerId = useCallback((id: string | null) => {
    setPlayerIdState(id);
    if (id) localStorage.setItem('playerId', id);
    else localStorage.removeItem('playerId');
  }, []);

  const clearRoom = useCallback(() => {
    setSnapshot(null);
    setPlayerId(null);
    localStorage.removeItem('roomId');
  }, [setPlayerId]);

  // Listen for STATE_SYNC and KICKED from backend
  useEffect(() => {
    if (!connection) return;

    const handleStateSync = (room: RoomSnapshot) => {
      setSnapshot(room);
      localStorage.setItem('roomId', room.id);
    };

    const handleKicked = () => {
      clearRoom();
      messageApi.warning("Voce foi removido da sala pelo lider.");
    };

    connection.on("STATE_SYNC", handleStateSync);
    connection.on("KICKED", handleKicked);
    return () => {
      connection.off("STATE_SYNC", handleStateSync);
      connection.off("KICKED", handleKicked);
    };
  }, [connection, clearRoom, messageApi]);

  // Reconnect after SignalR transport reconnection or page refresh
  useEffect(() => {
    if (!connection || !connected) {
      reconnectAttempted.current = false;
      return;
    }

    // Skip if already in a room (STATE_SYNC already received)
    if (snapshot) return;

    const savedRoomId = localStorage.getItem('roomId');
    const savedPlayerId = localStorage.getItem('playerId');

    if (savedRoomId && savedPlayerId && !reconnectAttempted.current) {
      reconnectAttempted.current = true;
      connection.invoke<boolean>("Reconnect", savedRoomId, savedPlayerId)
        .then((success) => {
          if (success) {
            setPlayerIdState(savedPlayerId);
            messageApi.success("Reconectado com sucesso!");
          } else {
            clearRoom();
            messageApi.warning("A sala expirou. Crie ou entre em uma nova sala.");
          }
        })
        .catch(() => {
          clearRoom();
          messageApi.error("Falha ao reconectar. Tente novamente.");
        });
    }
  }, [connection, connected, snapshot, clearRoom, messageApi]);

  const isWatching = snapshot !== null && (
    playerId === null || !snapshot.players.some(p => p.id === playerId)
  );

  return (
    <RoomContext.Provider value={{ snapshot, playerId, isWatching, setPlayerId, clearRoom }}>
      {contextHolder}
      {children}
    </RoomContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoom = () => useContext(RoomContext);