import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useConnection } from "../../context/ConnectionContext";
import { useRoom } from "../../context/RoomContext";

interface EnterRoomProps {
    roomId: string;
    onGoToCreate: () => void;
}

const EnterRoom: React.FC<EnterRoomProps> = ({ roomId, onGoToCreate }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { connection, connected } = useConnection();
    const { setPlayerId } = useRoom();
    const [username, setUsername] = useState<string>('');
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

    const enterRoom = async () => {
        if (!connection || !username || !roomId) return;

        setLoading(true);
        try {
            const playerId = await connection.invoke<string>('EnterRoom', roomId, username);
            if (playerId) {
                setPlayerId(playerId);
            } else {
                messageApi.error("Sala nao encontrada. Verifique o link e tente novamente.");
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
                onPressEnter={enterRoom}
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
                    color="primary"
                    variant="solid"
                    onClick={enterRoom}
                    loading={loading}
                    style={{ marginRight: "20px" }}
                    disabled={!roomId || !username || !connected}
                >
                    Entrar na Sala
                </Button>
                <Button
                    block
                    variant="outlined"
                    onClick={onGoToCreate}
                >
                    Criar nova sala
                </Button>
            </div>
        </div>
    );
};

export default EnterRoom;