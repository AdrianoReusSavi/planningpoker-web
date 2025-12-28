import { createContext, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import * as signalR from '@microsoft/signalr';

const ConnectionContext = createContext<{
    connection: signalR.HubConnection | null;
    connected: boolean;
    onRoom: boolean;
}>({ connection: null, connected: false, onRoom: false });

let connection: signalR.HubConnection | null = null;

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [connected, setConnected] = useState(false);
    const [onRoom, setOnRoom] = useState(false);

    useEffect(() => {
        if (!connection) {
            connection = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_SIGNALR_URL)
                .withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 3000 })
                .configureLogging(signalR.LogLevel.Information)
                .build();

            connection.onclose(() => setConnected(false));
            connection.onreconnected(() => setConnected(true));
            connection.on("OnRoom", (flag) => {
                setOnRoom(flag);
                if (!flag)
                    messageApi.open({ type: 'error', content: 'Sala não encontrada!' });
            });


            connection
                .start()
                .then(() => setConnected(true))
                .catch(console.error);
        }
    }, []);

    return (
        <ConnectionContext.Provider value={{ connection, connected, onRoom }}>
            {contextHolder}
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => useContext(ConnectionContext);