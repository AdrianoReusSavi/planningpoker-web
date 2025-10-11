import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";

interface EnterRoomProps {
    roomId: string;
}

const EnterRoom: React.FC<EnterRoomProps> = ({ roomId }) => {
    const { ws } = useConnection();
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        if (username) localStorage.setItem('username', username);
    }, [username]);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);
    }, []);

    const enterRoom = () => {
        if (!ws || !username || !roomId || ws.readyState !== WebSocket.OPEN) return;
        const userId = sessionStorage.getItem('userId');
        ws.send(JSON.stringify({ Action: 'EnterRoom', RoomId: roomId, Username: username, UserId: userId }));
    };

    const backRoom = () => {
        const url = window.location.origin + window.location.pathname;
        window.location.href = url;
    };

    return (
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
            <div style={{ display: 'flex' }}>
                <Button
                    block
                    type="primary"
                    onClick={enterRoom}
                    style={{ marginRight: '20px' }}
                    disabled={!roomId || !username || !ws || ws.readyState !== WebSocket.OPEN}
                >
                    Entrar na sala
                </Button>
                <Button
                    block
                    color="magenta"
                    variant="solid"
                    onClick={backRoom}
                >
                    Voltar
                </Button>
            </div>
        </div>
    );
};

export default EnterRoom;