import type { HubConnection } from '@microsoft/signalr';
import { Button, message, Typography } from 'antd';

const { Title } = Typography;

interface RoomPanelTopProps {
    connection: HubConnection | undefined;
    roomName: string;
    roomId: string;
    username: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    setVotos: React.Dispatch<React.SetStateAction<{ [username: string]: string }>>;
    setVotosRevelados: React.Dispatch<React.SetStateAction<boolean>>;
    setVotoAtual: React.Dispatch<React.SetStateAction<string>>;
    setUsersInRoom: React.Dispatch<React.SetStateAction<string[]>>
    setIsRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoomPanelTop: React.FC<RoomPanelTopProps> = ({ connection, roomName, roomId, username, setRoomId, setVotos, setVotosRevelados, setVotoAtual, setUsersInRoom, setIsRoom }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const copiarLink = () => {
        messageApi.open({
            type: 'success',
            content: 'link copiado com sucesso!',
        });
    };

    return (
        <>
            {contextHolder}
            <Title level={3} style={{ margin: 0, flex: 1, textAlign: 'left' }}>
                Sala: {roomName}
            </Title>

            <Button
                type="default"
                onClick={() => {
                    const url = `${window.location.origin}?roomId=${encodeURIComponent(roomId)}`;
                    navigator.clipboard.writeText(url);
                    copiarLink();
                }}
                style={{
                    padding: '0 16px',
                    height: '36px',
                    lineHeight: '36px',
                    fontSize: '14px',
                    marginLeft: '10px',
                }}
            >
                Convidar participantes
            </Button>

            <Button
                type="default"
                danger
                onClick={() => {
                    setIsRoom(false);
                    setRoomId('');
                    setVotos({});
                    setVotosRevelados(false);
                    setVotoAtual('');
                    setUsersInRoom([]);
                    connection?.invoke('LeaveRoom', roomId, username);
                }}
                style={{
                    marginRight: '10px',
                    height: '36px',
                    lineHeight: '36px',
                    fontSize: '14px',
                    marginLeft: '10px',
                }}
            >
                Sair da sala
            </Button>
        </>
    );
};

export default RoomPanelTop;