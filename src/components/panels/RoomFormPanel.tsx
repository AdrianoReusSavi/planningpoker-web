import type { HubConnection } from "@microsoft/signalr";
import { Button, Input } from "antd";
import { useEffect } from "react";

interface RoomFormPanelProps {
    connected: boolean;
    connection: HubConnection | undefined;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    roomName: string;
    setRoomName: React.Dispatch<React.SetStateAction<string>>;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    setIsRoom: React.Dispatch<React.SetStateAction<boolean>>;
    setRoomOwner: React.Dispatch<React.SetStateAction<string>>;
}

const RoomFormPanel: React.FC<RoomFormPanelProps> = ({
    connected,
    connection,
    username,
    setUsername,
    roomName,
    setRoomName,
    roomId,
    setRoomId,
    setIsRoom,
    setRoomOwner,
}) => {

    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('roomId');
        if (param) setRoomId(param);
    }, []);

    useEffect(() => {
        if (!connection) return;

        connection.on("RoomCreated", (id: string, name: string) => {
            setRoomId(id);
            setRoomName(name);
            setIsRoom(true);
            setRoomOwner(username);
        });

        connection.on("RoomJoined", (id: string, name: string) => {
            setRoomId(id);
            setRoomName(name);
            setIsRoom(true);
        });

        return () => {
            connection.off("RoomCreated");
            connection.off("RoomJoined");
        };
    }, [connection]);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);

        const params = new URLSearchParams(window.location.search);
        const sala = params.get('room');
        if (sala) setRoomName(sala);
    }, []);

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
    }, [username]);

    const createRoom = async () => {
        if (!connection || !username || !roomName) return;
        try {
            await connection.invoke('CreateRoom', username, roomName);
        } catch (err) {
            console.error(err);
        }
    };

    const enterRoom = async () => {
        if (!connection || !username || !roomId) return;
        try {
            await connection.invoke('EnterRoom', roomId, username);
            setIsRoom(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {!roomId ? (
                <div>
                    <Input
                        placeholder="Seu nome"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        placeholder="Nome da sala (exibido apenas)"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Button
                        type="primary"
                        block
                        onClick={createRoom}
                        disabled={!username || !roomName || !connected}
                    >
                        Criar Sala
                    </Button>
                </div>
            ) : (
                <div>
                    <Input
                        placeholder="Seu nome"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Input.Password
                        disabled
                        visibilityToggle={false}
                        value={roomId}
                        style={{ marginBottom: '10px' }}
                    />
                    <Button
                        type="primary"
                        block
                        onClick={enterRoom}
                        disabled={!roomId || !username || !connected}
                    >
                        Entrar na Sala
                    </Button>
                </div>
            )}
        </>
    );
};

export default RoomFormPanel;