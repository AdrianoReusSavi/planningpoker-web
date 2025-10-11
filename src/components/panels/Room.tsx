import { useEffect, useState } from "react";
import { message, Splitter } from "antd";
import { useConnection } from "../../context/ConnectionContext";
import Header from "../ui/room/Header";
import UserGroup from "../ui/room/UserGroup";
import VoteSummary from "../ui/room/VoteSummary";
import ControlButtons from "../ui/room/ControlButtons";
import VotingDeck from "../ui/room/VotingDeck";
import estimationOptions from '../../constants/estimationOptions';
import { Fireworks } from "../ui/gif/Fireworks";

interface User {
    ConnectionId: string;
    Username: string;
    Vote: string;
    Flipped: boolean;
}

const Room: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { ws } = useConnection();

    const [flipped, setFlipped] = useState(false);
    const [vote, setVote] = useState("");
    const [roomName, setRoomName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [votingDeck, setVotingDeck] = useState<number>(0);
    const [group, setGroup] = useState<User[]>([]);
    const [isLeader, setIsLeader] = useState(false);
    const [isWatching, setIsWatching] = useState(false);

    const allVoted = flipped || group.every(u => u.Vote?.length > 0);
    const sameVote = group.filter(u => u.Vote !== undefined).length > 1 && group.every(u => u.Vote === group[0].Vote);

    useEffect(() => {
        if (!vote || !roomId || !ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ Action: "SubmitVote", RoomId: roomId, Vote: vote }));
    }, [vote]);

    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event: MessageEvent) => {
            const msg = JSON.parse(event.data);
            switch (msg.action) {
                case "GetGroup":
                    setGroup(msg.users);
                    break;
                case "RoomSettings":
                    setRoomId(msg.roomId);
                    setRoomName(msg.roomName);
                    setVotingDeck(msg.votingDeck);
                    setFlipped(msg.votesRevealed);
                    if (!msg.votesRevealed) setVote("");
                    sessionStorage.setItem('roomId', msg.roomId);
                    if (!new URLSearchParams(window.location.search).has('roomId')) {
                        const url = `${window.location.origin}?roomId=${encodeURIComponent(msg.roomId)}`;
                        window.history.replaceState(null, '', url);
                    }
                    break;
                case "GetLeader":
                    setIsLeader(msg.isLeader);
                    break;
                case "GetWatching":
                    setIsWatching(msg.isWatching);
                    break;
                case "OnRoom":
                    if (!msg.success) {
                        messageApi.open({ type: "error", content: "Sala não encontrada!" });
                        sessionStorage.clear();
                    }
                    break;
            }
        };

        ws.addEventListener("message", handleMessage);
        return () => ws.removeEventListener("message", handleMessage);
    }, [ws]);

    const leaveRoom = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ Action: "LeaveRoom", RoomId: roomId }));
    };
    const revealVotes = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ Action: "RevealVotes", RoomId: roomId }));
    };
    const resetVotes = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ Action: "ResetVotes", RoomId: roomId }));
    };
    const copiarLink = () => messageApi.open({ type: "success", content: "Link copiado com sucesso!" });

    return (
        <div style={{ width: "100dvw", height: "100dvh" }}>
            {contextHolder}
            <Splitter>
                <Splitter.Panel></Splitter.Panel>
                <Splitter.Panel defaultSize="100%" min="50%" max="100%">
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                        <Header roomName={roomName} roomId={roomId} copiarLink={copiarLink} leaveRoom={leaveRoom} />
                        <UserGroup Group={group} Flipped={flipped} />
                        {flipped && allVoted && sameVote && <Fireworks />}
                        {!isWatching && (
                            <>
                                <div style={{ width: "100%", height: "15%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                                    <VoteSummary Flipped={flipped} AllVoted={allVoted} Group={group} VotingDeck={estimationOptions[votingDeck].list} />
                                    <ControlButtons
                                        isLeader={isLeader}
                                        flipped={flipped}
                                        allVoted={allVoted}
                                        revealVotes={revealVotes}
                                        resetVotes={resetVotes}
                                    />
                                </div>
                                <VotingDeck votingDeck={estimationOptions[votingDeck].list} vote={vote} setVote={setVote} flipped={flipped} />
                            </>
                        )}
                    </div>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
};

export default Room;