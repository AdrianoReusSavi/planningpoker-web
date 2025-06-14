import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";

interface CreateRoomProps {
}

const CreateRoom: React.FC<CreateRoomProps> = ({ }) => {
    const { connection } = useConnection();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');

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

    const createRoom = async () => {
        if (!connection || !username || !roomName) return;

        await connection.invoke("CreateRoom", username, roomName);
    };

    return (
        <div>
            <Input
                placeholder="Seu nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <Input
                placeholder="Nome da sala (exibido apenas)"
                maxLength={20}
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <Button
                type="primary"
                block
                onClick={createRoom}
                disabled={!username || !roomName || !connection}
            >
                Criar Sala
            </Button>
        </div>
    );
};

export default CreateRoom;