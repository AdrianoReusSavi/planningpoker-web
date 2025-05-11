import type { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import RoomPanelTop from './RoomPanelTop';
import RoomPanelMiddle from './RoomPanelMiddle';
import RoomPanelBottom from './RoomPanelBottom';

interface RoomPanelProps {
    connection: HubConnection | undefined;
    username: string;
    roomName: string;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    usersInRoom: string[];
    setUsersInRoom: React.Dispatch<React.SetStateAction<string[]>>
    setIsRoom: React.Dispatch<React.SetStateAction<boolean>>;
    roomOwner: string;
    setRoomOwner: React.Dispatch<React.SetStateAction<string>>;
}

const RoomPanel: React.FC<RoomPanelProps> = ({ connection, username, roomName, roomId, setRoomId, usersInRoom, setUsersInRoom, setIsRoom, roomOwner, setRoomOwner }) => {
    const [votos, setVotos] = useState<{ [username: string]: string }>({});
    const [votoAtual, setVotoAtual] = useState<string>('');
    const [votosRevelados, setVotosRevelados] = useState(false);

    useEffect(() => {
        if (!connection) return;

        connection.on('UpdateOwner', (ownerId: string) => {
            if (connection.connectionId === ownerId) {
                setRoomOwner(username);
            } else {
                const dono = usersInRoom.find(u => u !== username) || '';
                setRoomOwner(dono);
            }
        });

        connection.on('UpdateVote', (user: string, voto: string) => {
            setVotos(prev => ({ ...prev, [user]: voto }));
        });

        connection.on('VotesRevealed', (votos: { [username: string]: string }) => {
            setVotos(votos);
            setVotosRevelados(true);
        });

        connection.on('VotesReset', () => {
            setVotos({});
            setVotosRevelados(false);
            setVotoAtual('');
        });

        return () => {
            connection.off('UpdateOwner');
            connection.off('UpdateVote');
            connection.off('VotesRevealed');
            connection.off('VotesReset');
        };
    }, [connection]);

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', width: '90%', height: '10%' }}>
                <RoomPanelTop
                    connection={connection}
                    roomName={roomName}
                    roomId={roomId}
                    username={username}
                    setRoomId={setRoomId}
                    setVotos={setVotos}
                    setVotosRevelados={setVotosRevelados}
                    setVotoAtual={setVotoAtual}
                    setUsersInRoom={setUsersInRoom}
                    setIsRoom={setIsRoom}
                />
            </div>
            <div style={{ width: '90%', height: '80%' }}>
                <RoomPanelMiddle
                    usersInRoom={usersInRoom}
                    votos={votos}
                    votosRevelados={votosRevelados}
                    username={username}
                    connection={connection}
                    roomId={roomId}
                />
            </div>
            <div style={{ width: '90%', height: '10%' }}>
                <RoomPanelBottom
                    votoAtual={votoAtual}
                    votosRevelados={votosRevelados}
                    setVotoAtual={setVotoAtual}
                    connection={connection}
                    roomId={roomId}
                    username={username}
                    setVotos={setVotos}
                    usersInRoom={usersInRoom}
                    votos={votos}
                    roomOwner={roomOwner}
                />
            </div>
        </>
    )
};

export default RoomPanel;