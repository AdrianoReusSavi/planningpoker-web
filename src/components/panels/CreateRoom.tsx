import { Button, Input, message, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";
import { useRoom } from "../../context/RoomContext";
import estimationOptions from '../../constants/estimationOptions';

const CreateRoom: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { connection, connected } = useConnection();
    const { setPlayerId } = useRoom();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [votingDeck, setVotingDeck] = useState<number>(0);
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        try {
            const playerId = await connection.invoke<string>("CreateRoom", username, roomName, votingDeck);
            if (playerId) {
                setPlayerId(playerId);
            } else {
                messageApi.error("Falha ao criar sala. Tente novamente.");
            }
        } catch {
            messageApi.error("Erro de conexao. Verifique sua internet e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {contextHolder}
            <Input
                placeholder="Seu nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onPressEnter={createRoom}
                style={{ marginBottom: '10px' }}
            />
            <Input
                placeholder="Nome da sala (exibido apenas)"
                maxLength={20}
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onPressEnter={createRoom}
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
                loading={loading}
                disabled={!username || !roomName || !connected}
            >
                Criar Sala
            </Button>
        </div>
    );
};

export default CreateRoom;