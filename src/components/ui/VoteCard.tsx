import { Card } from "antd";

interface VoteCardProps {
    connection?: signalR.HubConnection;
    roomId: string;
    username: string;
    valor: string;
    votoAtual: string;
    votosRevelados: boolean;
    setVotos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setVotoAtual: (valor: string) => void;
}

const VoteCard: React.FC<VoteCardProps> = ({
    connection, roomId, username, valor, votoAtual, votosRevelados, setVotos, setVotoAtual
}) => {
    return (
        <Card
            hoverable
            onClick={() => {
                if (!votosRevelados) {
                    setVotoAtual(valor);
                    connection?.invoke('SendVote', roomId, valor);
                    setVotos((prev) => ({ ...prev, [username]: valor }));
                }
            }}
            style={{
                cursor: votosRevelados ? 'not-allowed' : 'pointer',
                backgroundColor: votoAtual === valor ? '#bae7ff' : '#fff',
                borderColor: votoAtual === valor ? '#1890ff' : '#d9d9d9',
                textAlign: 'center',
                width: 40,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                opacity: votosRevelados ? 0.5 : 1,
                transform: votoAtual === valor ? 'translateY(-5px)' : 'none',
            }}
        >
            {valor}
        </Card>
    );
};

export default VoteCard;