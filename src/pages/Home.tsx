import { Splitter } from "antd";
import { useEffect, useState } from "react";
import CreateRoom from "../components/panels/CreateRoom";
import EnterRoom from "../components/panels/EnterRoom";
import Room from "../components/panels/Room";
import { useConnection } from "../context/ConnectionContext";
import FlipCard from "../components/ui/gif/FlipCard";

const Home: React.FC = () => {
    const { onRoom } = useConnection();
    const [roomId, setRoomId] = useState<string>('');

    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('roomId');
        if (param) setRoomId(param);
    }, []);

    return onRoom ? (
        <Room />
    ) : (
        <Splitter style={{ width: '100dvw', height: '100dvh' }}>
            <Splitter.Panel size={'50%'} resizable={false}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <FlipCard />
                </div>
            </Splitter.Panel>
            <Splitter.Panel
                size={'50%'}
                resizable={false}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                {roomId ? <EnterRoom roomId={roomId} /> : <CreateRoom />}
            </Splitter.Panel>
        </Splitter>
    );
};

export default Home;