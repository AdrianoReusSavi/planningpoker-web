import { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

const ConnectionContext = createContext<{
    connection: signalR.HubConnection | null;
    connected: boolean;
    status: ConnectionStatus;
}>({ connection: null, connected: false, status: 'disconnected' });

let connection: signalR.HubConnection | null = null;

const retryDelays = [0, 1000, 2000, 5000, 10000, 15000, 30000];

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const connected = status === 'connected';

    useEffect(() => {
        if (!connection) {
            connection = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_SIGNALR_URL)
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: (retryContext) => {
                        const idx = Math.min(retryContext.previousRetryCount, retryDelays.length - 1);
                        const base = retryDelays[idx];
                        const jitter = Math.random() * 1000;
                        return base + jitter;
                    }
                })
                .configureLogging(signalR.LogLevel.Warning)
                .build();

            connection.onclose(() => setStatus('disconnected'));
            connection.onreconnecting(() => setStatus('reconnecting'));
            connection.onreconnected(() => setStatus('connected'));

            connection.serverTimeoutInMilliseconds = 60000;
            connection.keepAliveIntervalInMilliseconds = 15000;

            connection
                .start()
                .then(() => setStatus('connected'))
                .catch(console.error);
        }
    }, []);

    return (
        <ConnectionContext.Provider value={{ connection, connected, status }}>
            {children}
        </ConnectionContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConnection = () => useContext(ConnectionContext);
export type { ConnectionStatus };