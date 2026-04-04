import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message, Modal, notification } from "antd";
import { useConnection } from "../../context/ConnectionContext";
import { useRoom } from "../../context/RoomContext";
import Header from "../ui/room/Header";
import UserGroup from "../ui/room/UserGroup";
import VoteSummary from "../ui/room/VoteSummary";
import ControlButtons from "../ui/room/ControlButtons";
import VotingDeck from "../ui/room/VotingDeck";
import ReactionBar from "../ui/room/ReactionBar";
import FloatingReaction from "../ui/room/FloatingReaction";
import RoundHistory from "../ui/room/RoundHistory";
import estimationOptions from '../../constants/estimationOptions';
import { Fireworks } from "../ui/gif/Fireworks";

const DECK_NAMES = ["Fibonacci", "TShirtSizes", "Sequential", "Linear", "PowersOfTwo", "HalfPoint"];

const Room: React.FC = () => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [modal, modalContextHolder] = Modal.useModal();
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const { connected, connection, status } = useConnection();
    const { snapshot, playerId, isWatching, clearRoom } = useRoom();
    const [vote, setVote] = useState("");
    const [historyOpen, setHistoryOpen] = useState(false);
    const [lastReaction, setLastReaction] = useState<{ username: string; emoji: string } | null>(null);
    const [miniViewOpen, setMiniViewOpen] = useState(false);

    // Derive all state from snapshot
    const roomId = snapshot?.id ?? "";
    const roomName = snapshot?.roomName ?? "";
    const flipped = snapshot?.phase === "REVEALED";
    const isLeader = snapshot?.ownerId === playerId;

    const deckIndex = DECK_NAMES.indexOf(snapshot?.votingDeck ?? "");
    const votingDeck = estimationOptions[deckIndex >= 0 ? deckIndex : 0].list;

    const group = useMemo(() => {
        if (!snapshot) return [];
        return snapshot.players.map(p => ({
            id: p.id,
            username: p.name,
            hasVoted: p.hasVoted,
            vote: snapshot.votes[p.id] ?? "",
            connected: p.connected,
        }));
    }, [snapshot]);

    const allVoted = group.length > 0 && group.every(u => u.hasVoted);
    const someVoted = group.some(u => u.hasVoted);
    const votedUsers = group.filter(u => u.vote);
    const sameVote = votedUsers.length > 1 && votedUsers.every(u => u.vote === votedUsers[0].vote);

    // Clear local vote selection when a new voting round starts
    useEffect(() => {
        if (!flipped) setVote("");
    }, [flipped]);

    // Listen for reactions
    useEffect(() => {
        if (!connection) return;

        const handleReaction = (username: string, emoji: string) => {
            setLastReaction({ username, emoji });
        };

        const handleBreak = (username: string) => {
            notificationApi.info({
                message: '☕ Pausa solicitada',
                description: `${username} pediu uma pausa para cafe.`,
                placement: 'top',
                duration: 6,
            });
        };

        connection.on("REACTION", handleReaction);
        connection.on("BREAK_REQUESTED", handleBreak);
        return () => {
            connection.off("REACTION", handleReaction);
            connection.off("BREAK_REQUESTED", handleBreak);
        };
    }, [connection, messageApi, notificationApi]);

    const submitVote = async (value: string) => {
        if (!connection || !connected || !roomId) return;
        setVote(value);
        try {
            await connection.invoke("SubmitVote", roomId, value);
        } catch {
            messageApi.error("Falha ao enviar voto. Verifique sua conexao.");
            setVote("");
        }
    };

    const leaveRoom = () => {
        modal.confirm({
            title: "Sair da sala",
            content: "Tem certeza que deseja sair? Voce sera removido da votacao.",
            okText: "Sair",
            cancelText: "Cancelar",
            okButtonProps: { danger: true },
            onOk: async () => {
                if (!connection || !connected) return;
                try {
                    await connection.invoke("LeaveRoom", roomId);
                } finally {
                    clearRoom();
                }
            },
        });
    };

    const revealVotes = async () => {
        if (!connection || !connected) return;
        try {
            await connection.invoke("RevealVotes", roomId);
        } catch {
            messageApi.error("Falha ao revelar votos.");
        }
    };

    const resetVotes = async () => {
        if (!connection || !connected) return;
        try {
            await connection.invoke("ResetVotes", roomId);
        } catch {
            messageApi.error("Falha ao resetar votos.");
        }
    };

    const kickPlayer = (targetPlayerId: string) => {
        const target = group.find(u => u.id === targetPlayerId);
        modal.confirm({
            title: "Remover participante",
            content: `Tem certeza que deseja remover ${target?.username ?? 'este participante'} da sala?`,
            okText: "Remover",
            cancelText: "Cancelar",
            okButtonProps: { danger: true },
            onOk: async () => {
                if (!connection || !connected) return;
                try {
                    await connection.invoke("KickPlayer", roomId, targetPlayerId);
                } catch {
                    messageApi.error("Falha ao remover participante.");
                }
            },
        });
    };

    const transferOwnership = (targetPlayerId: string) => {
        const target = group.find(u => u.id === targetPlayerId);
        modal.confirm({
            title: "Transferir lideranca",
            content: `Transferir lideranca para ${target?.username ?? 'este participante'}? Voce perdera os controles de lider.`,
            okText: "Transferir",
            cancelText: "Cancelar",
            onOk: async () => {
                if (!connection || !connected) return;
                try {
                    await connection.invoke("TransferOwnership", roomId, targetPlayerId);
                } catch {
                    messageApi.error("Falha ao transferir lideranca.");
                }
            },
        });
    };

    const sendReaction = useCallback(async (emoji: string) => {
        if (!connection || !connected || !roomId) return;
        try {
            await connection.invoke("SendReaction", roomId, emoji);
        } catch { /* rate limited or disconnected */ }
    }, [connection, connected, roomId]);

    const requestBreak = useCallback(async () => {
        if (!connection || !connected || !roomId) return;
        try {
            await connection.invoke("RequestBreak", roomId);
        } catch { /* rate limited or disconnected */ }
    }, [connection, connected, roomId]);

    // BroadcastChannel relay for mini popup view
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        channelRef.current = new BroadcastChannel('planning-poker-sync');
        return () => {
            channelRef.current?.close();
            channelRef.current = null;
        };
    }, []);

    // Broadcast snapshot to mini view on every change
    useEffect(() => {
        if (channelRef.current && snapshot && playerId) {
            channelRef.current.postMessage({ type: 'SYNC', snapshot, playerId });
        }
    }, [snapshot, playerId]);

    // Listen for commands from mini view
    useEffect(() => {
        const channel = channelRef.current;
        if (!channel) return;

        const handler = async (e: MessageEvent) => {
            const data = e.data;
            if (data.type === 'MINI_OPENED') {
                setMiniViewOpen(true);
                return;
            }
            if (data.type === 'MINI_CLOSED') {
                setMiniViewOpen(false);
                return;
            }
            if (!connection || !connected) return;
            try {
                if (data.type === 'VOTE' && roomId) {
                    setVote(data.value);
                    await connection.invoke('SubmitVote', roomId, data.value);
                } else if (data.type === 'REVEAL' && roomId) {
                    await connection.invoke('RevealVotes', roomId);
                } else if (data.type === 'RESET' && roomId) {
                    await connection.invoke('ResetVotes', roomId);
                } else if (data.type === 'REQUEST_SYNC' && snapshot && playerId) {
                    channel.postMessage({ type: 'SYNC', snapshot, playerId });
                }
            } catch { /* errors handled by main UI */ }
        };

        channel.addEventListener('message', handler);
        return () => channel.removeEventListener('message', handler);
    }, [connection, connected, roomId, snapshot, playerId]);

    const copiarLink = () => {
        messageApi.success("Link copiado com sucesso!");
    };

    const openMiniView = () => {
        window.open(
            '/mini',
            'planning-poker-mini',
            'width=520,height=400,resizable=yes,scrollbars=no'
        );
    };

    return (
        <div style={{ width: "100dvw", height: "100dvh", overflow: "hidden" }}>
            {messageContextHolder}
            {modalContextHolder}
            {notificationContextHolder}
            <FloatingReaction reaction={lastReaction} />
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Header
                            roomName={roomName}
                            roomId={roomId}
                            connectionStatus={status}
                            historyCount={snapshot?.history?.length ?? 0}
                            copiarLink={copiarLink}
                            leaveRoom={leaveRoom}
                            openHistory={() => setHistoryOpen(true)}
                            openMiniView={openMiniView}
                        />
                        <UserGroup
                            group={group}
                            flipped={flipped}
                            isLeader={isLeader}
                            currentPlayerId={playerId}
                            ownerId={snapshot?.ownerId ?? null}
                            onKick={kickPlayer}
                            onTransfer={transferOwnership}
                        />

                        {flipped && allVoted && sameVote ? (<Fireworks />) : (<></>)}

                        {!isWatching ? (
                            <>
                                <div
                                    style={{
                                        width: "100%",
                                        flex: "0 0 auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: miniViewOpen ? "20px 0" : "12px 0",
                                        gap: "8px",
                                    }}
                                >
                                    <VoteSummary flipped={flipped} allVoted={allVoted} group={group} votingDeck={votingDeck} />
                                    {!miniViewOpen && (
                                        <ControlButtons
                                            isLeader={isLeader}
                                            flipped={flipped}
                                            allVoted={allVoted}
                                            someVoted={someVoted}
                                            revealVotes={revealVotes}
                                            resetVotes={resetVotes}
                                        />
                                    )}
                                </div>
                                {!miniViewOpen && (
                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "8px",
                                        flex: "0 0 auto",
                                        justifyContent: "center",
                                        padding: "12px 0 16px",
                                    }}>
                                        <VotingDeck votingDeck={votingDeck} vote={vote} setVote={submitVote} flipped={flipped} />
                                        <ReactionBar onReact={sendReaction} onBreak={requestBreak} />
                                    </div>
                                )}
                            </>
                        ) : (<></>)}
                    </div>
            <RoundHistory
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                history={snapshot?.history ?? []}
            />
        </div>
    );
};

export default Room;