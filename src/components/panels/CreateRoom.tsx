import { Button, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";
import estimationOptions from '../../constants/estimationOptions';

interface CreateRoomProps {
}

const CreateRoom: React.FC<CreateRoomProps> = ({ }) => {
    const { connection } = useConnection();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [votingDeck, setVotingDeck] = useState<number>(0);

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

        await connection.invoke("CreateRoom", username, roomName, votingDeck);
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

            <Select
                style={{ width: '100%', marginBottom: '10px' }}
                defaultValue={0}
                onChange={setVotingDeck}
                options={estimationOptions}
                optionRender={(option) => (
                    <Space>
                        {option.data.label}
                        <span style={{ color: '#9CA3AF' }}>{option.data.desc}</span>
                    </Space>
                )}
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