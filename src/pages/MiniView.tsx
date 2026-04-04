import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConfigProvider, Tag, theme as antTheme } from 'antd';
import type { RoomSnapshot } from '../types/room';
import VotingDeck from '../components/ui/room/VotingDeck';
import ControlButtons from '../components/ui/room/ControlButtons';
import VoteSummary from '../components/ui/room/VoteSummary';
import estimationOptions from '../constants/estimationOptions';

const CHANNEL_NAME = 'planning-poker-sync';
const DECK_NAMES = ["Fibonacci", "TShirtSizes", "Sequential", "Linear", "PowersOfTwo", "HalfPoint"];

const MiniView: React.FC = () => {
    const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [vote, setVote] = useState('');
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        const ch = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = ch;

        const handler = (e: MessageEvent) => {
            if (e.data.type === 'SYNC') {
                setSnapshot(e.data.snapshot);
                setPlayerId(e.data.playerId);
            }
        };
        ch.addEventListener('message', handler);
        ch.postMessage({ type: 'REQUEST_SYNC' });
        ch.postMessage({ type: 'MINI_OPENED' });

        const handleBeforeUnload = () => {
            ch.postMessage({ type: 'MINI_CLOSED' });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            ch.postMessage({ type: 'MINI_CLOSED' });
            window.removeEventListener('beforeunload', handleBeforeUnload);
            ch.removeEventListener('message', handler);
            ch.close();
            channelRef.current = null;
        };
    }, []);

    const flipped = snapshot?.phase === 'REVEALED';
    const isLeader = snapshot?.ownerId === playerId;

    const deckIndex = DECK_NAMES.indexOf(snapshot?.votingDeck ?? '');
    const votingDeck = estimationOptions[deckIndex >= 0 ? deckIndex : 0].list;

    const group = useMemo(() => {
        if (!snapshot) return [];
        return snapshot.players.map(p => ({
            id: p.id,
            username: p.name,
            hasVoted: p.hasVoted,
            vote: snapshot.votes[p.id] ?? '',
            connected: p.connected,
        }));
    }, [snapshot]);

    const allVoted = group.length > 0 && group.every(u => u.hasVoted);
    const someVoted = group.some(u => u.hasVoted);
    const votedCount = group.filter(u => u.hasVoted).length;

    useEffect(() => {
        if (!flipped) setVote('');
    }, [flipped]);

    const postMessage = useCallback((msg: Record<string, unknown>) => {
        channelRef.current?.postMessage(msg);
    }, []);

    const submitVote = (value: string) => {
        setVote(value);
        postMessage({ type: 'VOTE', value });
    };

    const revealVotes = () => postMessage({ type: 'REVEAL' });
    const resetVotes = () => postMessage({ type: 'RESET' });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => {
        const themeCh = new BroadcastChannel('planning-poker-theme');
        const handler = (e: MessageEvent) => {
            setIsDark(e.data.isDark);
        };
        themeCh.addEventListener('message', handler);
        return () => {
            themeCh.removeEventListener('message', handler);
            themeCh.close();
        };
    }, []);

    if (!snapshot) {
        return (
            <ConfigProvider theme={{ algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    fontSize: 16,
                    padding: 24,
                    textAlign: 'center',
                }}>
                    Aguardando conexao com a sala principal...
                    <br />
                    Mantenha a aba principal aberta.
                </div>
            </ConfigProvider>
        );
    }

    return (
        <ConfigProvider theme={{ algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                padding: '12px 16px',
                gap: 12,
                overflow: 'auto',
            }}>
                {/* Header compacto */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                }}>
                    <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                    }}>
                        {snapshot.roomName}
                    </span>
                    <Tag color={flipped ? 'purple' : 'blue'}>
                        {flipped ? 'Revelado' : 'Votando'}
                    </Tag>
                    <Tag>
                        {votedCount}/{group.length} votaram
                    </Tag>
                </div>

                {/* Resumo dos votos */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 44,
                    justifyContent: 'center',
                }}>
                    <VoteSummary flipped={flipped} allVoted={allVoted} group={group} votingDeck={votingDeck} />
                </div>

                {/* Botoes de controle */}
                <ControlButtons
                    isLeader={isLeader}
                    flipped={flipped}
                    allVoted={allVoted}
                    someVoted={someVoted}
                    revealVotes={revealVotes}
                    resetVotes={resetVotes}
                />

                {/* Deck de votacao */}
                <VotingDeck votingDeck={votingDeck} vote={vote} setVote={submitVote} flipped={flipped} />
            </div>
        </ConfigProvider>
    );
};

export default MiniView;
