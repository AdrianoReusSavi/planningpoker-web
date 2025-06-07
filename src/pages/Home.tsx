import useConnection from "../hooks/useConnection";
import PanelContainer from "../components/PanelContainer";
import RoomFormPanel from "../components/panels/RoomFormPanel";
import { useEffect, useState } from "react";
import RoomPanel from "../components/panels/RoomPanel";

const Home: React.FC = () => {
    const { connected, connection } = useConnection();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [isRoom, setIsRoom] = useState<boolean>(false);
    const [roomOwner, setRoomOwner] = useState<string>('');
    const [usersInRoom, setUsersInRoom] = useState<string[]>([]);

    useEffect(() => {
        if (!connection) return;

        connection.on('UpdateUsers', (usuarios: string[]) => {
            setUsersInRoom(usuarios);
        });

        return () => {
            connection.off('UpdateUsers');
        };
    }, [connection]);

    useEffect(() => {
        if (!connection) return;

        const interval = setInterval(() => {
            if (connection.state === "Connected") {
                connection.invoke("Ping").catch(err => {
                console.error("Ping? ", err);
            });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [connection]);

    useEffect(() => {
        if (!connection) return;

        connection.on("Pong", () => {
            console.log("Pong");
        });

        return () => {
            connection.off("Pong");
        };
    }, [connection]);

    return (
        <PanelContainer>
            {!isRoom ? (
                <RoomFormPanel
                    connected={connected}
                    connection={connection}
                    username={username}
                    setUsername={setUsername}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    roomId={roomId}
                    setRoomId={setRoomId}
                    setIsRoom={setIsRoom}
                    setRoomOwner={setRoomOwner}
                />
            ) : (
                <RoomPanel
                    connection={connection}
                    username={username}
                    roomName={roomName}
                    roomId={roomId}
                    setRoomId={setRoomId}
                    usersInRoom={usersInRoom}
                    setUsersInRoom={setUsersInRoom}
                    setIsRoom={setIsRoom}
                    roomOwner={roomOwner}
                    setRoomOwner={setRoomOwner}
                />
            )}
        </PanelContainer>
    );
};

export default Home;