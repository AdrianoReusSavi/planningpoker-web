import { Button, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";
import estimationOptions from '../../constants/estimationOptions';

const CreateRoom: React.FC = () => {
    const { ws, connected } = useConnection();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [votingDeck, setVotingDeck] = useState<number>(0);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);
    }, []);

    useEffect(() => {
        if (username) localStorage.setItem('username', username);
    }, [username]);

    const createRoom = () => {
        if (!ws || !connected || !username || !roomName) return;
        const userId = sessionStorage.getItem('userId');
        ws.send(JSON.stringify({ Action: "CreateRoom", Username: username, UserId: userId, RoomName: roomName, VotingDeck: votingDeck }));
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
                disabled={!username || !roomName || !connected}
            >
                Criar Sala
            </Button>
        </div>
    );
};

export default CreateRoom;