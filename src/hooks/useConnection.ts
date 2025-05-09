import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseSignalRConnectionResult {
    connected: boolean;
    connection?: signalR.HubConnection;
}

export default function useConnection(): UseSignalRConnectionResult {
    const [connected, setConnected] = useState(false);
    const [connection, setConnection] = useState<signalR.HubConnection | undefined>(undefined);

    const signalrUrl = import.meta.env.VITE_SIGNALR_URL;

    useEffect(() => {
        const connectionInstance = new signalR.HubConnectionBuilder()
            .withUrl(signalrUrl, {
                withCredentials: true,
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: () => 3000,
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionInstance.serverTimeoutInMilliseconds = 60000;
        connectionInstance.keepAliveIntervalInMilliseconds = 20000;

        connectionInstance
            .start()
            .then(() => {
                setConnected(true);
                setConnection(connectionInstance);
            })
            .catch((error) => {
                console.error('Erro ao conectar ao SignalR:', error);
            });

        return () => {
            connectionInstance
                .stop()
                .then(() => console.log('Conexão SignalR encerrada'))
                .catch((err) => console.error('Erro ao parar a conexão SignalR:', err));
        };
    }, []);

    return { connected, connection };
}