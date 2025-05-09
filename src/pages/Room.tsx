import React, { useEffect, useState } from 'react';
import { Button, Input, Typography, message, Card, Row, Col } from 'antd';
import useConnection from "../hooks/useConnection";
import PanelContainer from '../components/PanelContainer';

const { Title } = Typography;

const Room: React.FC = () => {
    const { connected, connection } = useConnection();

    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [currentRoom, setCurrentRoom] = useState<string>('');
    const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
    const [donoSala, setDonoSala] = useState<string>('');

    const [votos, setVotos] = useState<{ [username: string]: string }>({});
    const [votoAtual, setVotoAtual] = useState<string>('');
    const [votosRevelados, setVotosRevelados] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);

        const params = new URLSearchParams(window.location.search);
        const sala = params.get('room');
        if (sala) setRoomName(sala);
    }, []);

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
    }, [username]);

    const criarSala = async () => {
        if (!roomName || !username) {
            message.error('Informe o nome da sala e o seu nome');
            return;
        }

        if (!connection) return;

        try {
            await connection.invoke('CriarSala', roomName, username);
            setCurrentRoom(roomName);
            setRoomName('');
            message.success(`Sala criada: ${roomName}`);
        } catch (err) {
            message.error('Erro ao criar sala');
            console.error(err);
        }
    };

    const entrarSala = async () => {
        if (!roomName || !username) {
            message.error('Informe o nome da sala e o seu nome');
            return;
        }

        if (!connection) return;

        try {
            await connection.invoke('EntrarSala', roomName, username);
            setCurrentRoom(roomName);
            setRoomName('');
            message.success(`Você entrou na sala: ${roomName}`);
        } catch (err) {
            message.error('Erro ao entrar na sala');
            console.error(err);
        }
    };

    const revelarVotos = async () => {
        if (!connection || !currentRoom) return;

        try {
            await connection.invoke('RevelarVotes', currentRoom);
        } catch (err) {
            message.error('Erro ao revelar os votos');
            console.error(err);
        }
    };

    useEffect(() => {
        if (!connection) return;

        connection.on('AtualizarUsuarios', (usuarios: string[]) => {
            setUsersInRoom(usuarios);
        });

        connection.on('AtualizarVoto', (user: string, voto: string) => {
            setVotos(prev => ({ ...prev, [user]: voto }));
        });

        connection.on('VotesRevelados', (votos: { [username: string]: string }) => {
            setVotos(votos);
            setVotosRevelados(true);
        });

        connection.on('VotacaoResetada', () => {
            setVotos({});
            setVotosRevelados(false);
            setVotoAtual('');
        });

        connection.on('AtualizarDono', (ownerId: string) => {
            if (connection.connectionId === ownerId) {
                setDonoSala(username);
            } else {
                const dono = usersInRoom.find(u => u !== username) || '';
                setDonoSala(dono);
            }
        });

        return () => {
            connection.off('AtualizarUsuarios');
            connection.off('VotesRevelados');
            connection.off('VotacaoResetada');
            connection.off('AtualizarDono');
        };
    }, [connection, usersInRoom, username]);

    const copiarLink = () => {
        messageApi.open({
          type: 'success',
          content: 'link copiado com sucesso!',
        });
      };

    const fibonacciDeck = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '∞'];

    const todosVotaram = usersInRoom.every(user => votos[user]);

    return (
        <PanelContainer>
            {contextHolder}
            {!currentRoom ? (
                <div>
                    <Input
                        placeholder="Seu nome"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        placeholder="Nome da sala"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <Button
                            type="primary"
                            block
                            onClick={criarSala}
                            disabled={!roomName || !username || !connected}
                            style={{ flex: 1 }}
                        >
                            Criar Sala
                        </Button>
                        <Button
                            type="default"
                            block
                            onClick={entrarSala}
                            disabled={!roomName || !username || !connected}
                            style={{ flex: 1 }}
                        >
                            Entrar na Sala
                        </Button>
                    </div>
                </div>
            ) : (
                <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '0 1 auto', textAlign: 'center', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Title level={3} style={{ margin: 0, flex: 1, textAlign: 'left' }}>
                                Sala: {currentRoom}
                            </Title>

                            <Button
                                type="default"
                                onClick={() => {
                                    const url = `${window.location.origin}?room=${encodeURIComponent(currentRoom)}`;
                                    navigator.clipboard.writeText(url);
                                    copiarLink()
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
                        </div>
                    </div>

                    <div style={{ flex: '1 1 auto', padding: '20px 0' }}>
                        <Row gutter={[16, 16]} justify="center">
                            {usersInRoom.map((user) => (
                                <Col xs={24} sm={12} md={5} lg={5} xl={5} key={user}>
                                    <Card
                                        bordered
                                        hoverable
                                        style={{
                                            textAlign: 'center',
                                            borderColor: user === username ? '#1890ff' : '#d9d9d9',
                                            backgroundColor: votosRevelados && votos[user] ? '#f0f9ff' : '#fff',
                                            minWidth: '100px',
                                        }}
                                        bodyStyle={{ padding: '12px' }}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{user}</div>
                                        <div
                                            style={{
                                                fontSize: '32px',
                                                marginTop: 12,
                                                color: votosRevelados ? '#000' : '#999',
                                            }}
                                        >
                                            {votosRevelados
                                                ? votos[user] || '---'
                                                : votos[user]
                                                    ? '✅'
                                                    : '❌'}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {username === donoSala && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                            <Button
                                type="primary"
                                onClick={revelarVotos}
                                disabled={!todosVotaram || votosRevelados}
                                style={{ height: '36px', minWidth: '120px' }}
                            >
                                Revelar Votos
                            </Button>

                            <Button
                                type="primary"
                                onClick={() => connection?.invoke('ResetarVotes', currentRoom)}
                                disabled={!votosRevelados}
                                style={{ height: '36px', minWidth: '120px' }}
                            >
                                Resetar
                            </Button>
                        </div>
                    )}

                    <div style={{ flex: '0 1 auto', marginBottom: '20px', padding: '20px' }}>
                        <Row gutter={[8, 8]} justify="center">
                            {fibonacciDeck.map((valor) => (
                                <Col key={valor}>
                                    <Card
                                        onClick={() => {
                                            if (!votosRevelados) {
                                                setVotoAtual(valor);
                                                connection?.invoke('EnviarVoto', currentRoom, valor);
                                                setVotos((prev) => ({ ...prev, [username]: valor }));
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!votosRevelados) {
                                                e.currentTarget.style.borderColor = '#40a9ff';
                                                e.currentTarget.style.boxShadow = '0 0 5px rgba(24, 144, 255, 0.5)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!votosRevelados && valor !== votoAtual) {
                                                e.currentTarget.style.borderColor = '#d9d9d9';
                                                e.currentTarget.style.boxShadow = 'none';
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
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        {valor}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            )}
        </PanelContainer>
    );
};

export default Room;