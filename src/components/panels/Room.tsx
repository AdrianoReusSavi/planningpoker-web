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

interface RoomProps { }

interface User {
    connectionId: string;
    username: string;
    vote: string;
    flipped: boolean;
}

const Room: React.FC<RoomProps> = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { connected, connection } = useConnection();
    const [flipped, setFlipped] = useState(false);
    const [vote, setVote] = useState("");

    const [roomName, setRoomName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [votingDeck, setVotingDeck] = useState<number>(0);
    const [group, setGroup] = useState<User[]>([]);
    const [isLeader, setIsLeader] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const allVoted = group.every((user) => user.vote?.length > 0);
    const sameVote = group.filter(u => u.vote !== undefined).length > 1 && group.every(u => u.vote === group[0].vote);

    useEffect(() => {
        if (!connection || !connected) return;
        connection.invoke("GetRoomSettings");
    }, [connection, connected]);

    useEffect(() => {
        if (!connection || !connected) return;

        const handleGroup = (group: User[]) => setGroup(group);
        const handleSettings = (roomId: string, roomName: string, votingDeck: number, votesRevealed: boolean) => {
            setRoomId(roomId);
            setRoomName(roomName);
            setVotingDeck(votingDeck);
            setFlipped(votesRevealed);
            if (!votesRevealed)
                setVote("");
        };
        const handleLeader = (isLeader: boolean) => {
            setIsLeader(isLeader);
        };
        const handleWatching = (isWatching: boolean) => {
            setIsWatching(isWatching);
        };

        connection.on("GetGroup", handleGroup);
        connection.on("GetLeader", handleLeader);
        connection.on("GetWatching", handleWatching);
        connection.on("RoomSettings", handleSettings);

        connection.invoke("GetRoomSettings");

        return () => {
            connection.off("GetGroup", handleGroup);
            connection.off("GetLeader", handleLeader);
            connection.off("GetWatching", handleWatching);
            connection.off("RoomSettings", handleSettings);
        };
    }, [connection, connected]);

    useEffect(() => {
        if (!connection || !connected || vote === "") return;
        connection.invoke("SubmitVote", roomId, vote);
    }, [vote]);

    const leaveRoom = async () => {
        if (!connection || !connected) return;
        await connection.invoke("LeaveRoom", roomId);
    };

    const revealVotes = async () => {
        if (!connection || !connected) return;
        await connection.invoke("RevealVotes", roomId);
    };

    const resetVotes = async () => {
        if (!connection || !connected) return;
        await connection.invoke("ResetVotes", roomId);
    };

    const copiarLink = () => {
        messageApi.open({
            type: "success",
            content: "link copiado com sucesso!",
        });
    };

    return (
        <div style={{ width: "100dvw", height: "100dvh" }}>
            {contextHolder}
            <Splitter>
                <Splitter.Panel></Splitter.Panel>
                <Splitter.Panel defaultSize="100%" min="50%" max="100%">
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Header roomName={roomName} roomId={roomId} copiarLink={copiarLink} leaveRoom={leaveRoom} />
                        <UserGroup group={group} flipped={flipped} />

                        {flipped && allVoted && sameVote ? (<Fireworks />) : (<></>)}

                        {!isWatching ? (
                            <>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "15%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                    }}
                                >
                                    <VoteSummary flipped={flipped} allVoted={allVoted} group={group} votingDeck={estimationOptions[votingDeck].list} />
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
                        ) : (<></>)}
                    </div>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
};

export default Room;