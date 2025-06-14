import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";

interface EnterRoomProps {
    roomId: string;
}

const EnterRoom: React.FC<EnterRoomProps> = ({ roomId }) => {
    const { connection } = useConnection();
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
    }, [username]);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername)
            setUsername(savedUsername);
    }, []);

    const enterRoom = async () => {
        if (!connection || !username || !roomId) return;

        await connection.invoke('EnterRoom', roomId, username);
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
            <Button
                type="primary"
                block
                onClick={enterRoom}
                disabled={!roomId || !username || !connection}
            >
                Entrar na Sala
            </Button>
        </div>
    );
};

export default EnterRoom;