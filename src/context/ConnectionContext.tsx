import { createContext, useContext, useEffect, useState, useRef } from "react";
import { message } from "antd";

interface ConnectionContextType {
    ws: WebSocket | null;
    connected: boolean;
    onRoom: boolean;
}

const ConnectionContext = createContext<ConnectionContextType>({
    ws: null,
    connected: false,
    onRoom: false
});

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [connected, setConnected] = useState(false);
    const [onRoom, setOnRoom] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WS_URL);
        wsRef.current = ws;

        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            switch (msg.action) {
                case "OnRoom":
                    setOnRoom(msg.success);
                    if (!msg.success) {
                        if (msg.message) 
                            messageApi.open({ type: "error", content: msg.message });
                        sessionStorage.clear();
                    }
                    break;
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <ConnectionContext.Provider value={{ ws: wsRef.current, connected, onRoom }}>
            {contextHolder}
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => useContext(ConnectionContext);