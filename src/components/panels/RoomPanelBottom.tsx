import { Row, Col, Button } from 'antd';
import VoteCard from '../ui/VoteCard';

interface RoomPanelBottomProps {
    votoAtual: string;
    votosRevelados: boolean;
    setVotoAtual: (valor: string) => void;
    connection?: signalR.HubConnection;
    roomId: string;
    username: string;
    setVotos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    usersInRoom: string[];
    votos: Record<string, string>;
    roomOwner: string;
}

const RoomPanelBottom: React.FC<RoomPanelBottomProps> = ({
    votoAtual,
    votosRevelados,
    setVotoAtual,
    connection,
    roomId,
    username,
    setVotos,
    usersInRoom,
    votos,
    roomOwner
}) => {
    const revelarVotos = async () => {
        if (!connection || !roomId) return;

        try {
            await connection.invoke('RevealVotes', roomId);
        } catch (err) {
            console.error(err);
        }
    };

    const fibonacciDeck = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '∞'];
    const todosVotaram = usersInRoom.every(user => votos[user]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {votosRevelados && (
                <div style={{
                    gap: '8px',
                    position: 'absolute',
                    textAlign: 'center',
                    bottom: '150px',
                    width: '100%',
                    zIndex: 1
                }}>
                    {(() => {
                        const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
                        const numeros = Object.values(votos)
                            .map(v => parseInt(v))
                            .filter(v => !isNaN(v));

                        if (numeros.length === 0) return null;

                        const media = numeros.reduce((a, b) => a + b, 0) / numeros.length;

                        const aproximada = fibonacci.reduce((prev, curr) =>
                            Math.abs(curr - media) < Math.abs(prev - media) ? curr : prev
                        );

                        return (
                            <>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    Média aproximada: {aproximada}
                                </div>
                                <div style={{ fontSize: '14px', color: '#999' }}>
                                    Média exata: {media.toFixed(2)}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                position: 'absolute',
                bottom: '100px',
                width: '100%',
                zIndex: 1
            }}>
                <Button
                    type="primary"
                    onClick={revelarVotos}
                    disabled={!todosVotaram || votosRevelados}
                    style={{
                        height: '36px',
                        minWidth: '120px',
                        visibility: username === roomOwner ? 'visible' : 'hidden'
                    }}
                >
                    Revelar Votos
                </Button>

                <Button
                    type="primary"
                    onClick={() => connection?.invoke('ResetVotes', roomId)}
                    disabled={!votosRevelados}
                    style={{
                        height: '36px',
                        minWidth: '120px',
                        visibility: username === roomOwner ? 'visible' : 'hidden'
                    }}
                >
                    Resetar
                </Button>
            </div>

            <Row gutter={[8, 8]} justify="center">
                {fibonacciDeck.map((valor) => (
                    <Col key={valor}>
                        <VoteCard
                            connection={connection}
                            roomId={roomId}
                            username={username}
                            valor={valor}
                            votoAtual={votoAtual}
                            votosRevelados={votosRevelados}
                            setVotos={setVotos}
                            setVotoAtual={setVotoAtual}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default RoomPanelBottom;