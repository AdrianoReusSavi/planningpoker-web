import { Button, Splitter } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import CreateRoom from "../components/panels/CreateRoom";
import EnterRoom from "../components/panels/EnterRoom";
import Room from "../components/panels/Room";
import { useRoom } from "../context/RoomContext";
import { useTheme } from "../context/ThemeContext";
import FlipCard from "../components/ui/gif/FlipCard";
import SupportButton from "../components/ui/support/SupportButton";

const Home: React.FC = () => {
    const { snapshot } = useRoom();
    const { isDark, toggle } = useTheme();
    const [roomId, setRoomId] = useState<string>('');

    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('roomId');
        if (param) setRoomId(param);
    }, []);

    const goToCreate = () => {
        setRoomId('');
        window.history.replaceState({}, '', window.location.pathname);
    };

    return (
        <>
            {snapshot ? (
                <Room />
            ) : (
                <>
                    <Button
                        type="text"
                        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                        onClick={toggle}
                        aria-label={isDark ? "Modo claro" : "Modo escuro"}
                        style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
                    />
                    <Splitter style={{ width: '100dvw', height: '100dvh' }}>
                        <Splitter.Panel size={'50%'} resizable={false}>
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <FlipCard />
                            </div>
                        </Splitter.Panel>
                        <Splitter.Panel
                            size={'50%'}
                            resizable={false}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {roomId ? <EnterRoom roomId={roomId} onGoToCreate={goToCreate} /> : <CreateRoom />}
                        </Splitter.Panel>
                    </Splitter>
                </>
            )}
            <SupportButton />
        </>
    );
};

export default Home;