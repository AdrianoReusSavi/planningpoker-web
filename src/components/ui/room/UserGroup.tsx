import { Col, Row } from "antd";
import UserCard from "../cards/UserCard";

interface User {
    id: string;
    username: string;
    hasVoted: boolean;
    vote: string;
    connected: boolean;
}

interface UserGroupProps {
    group: User[];
    flipped: boolean;
    isLeader: boolean;
    currentPlayerId: string | null;
    ownerId: string | null;
    onKick: (playerId: string) => void;
    onTransfer: (playerId: string) => void;
}

const CARD_PALETTE = [
    '#818cf8',
    '#c084fc',
    '#f472b6',
    '#fb923c',
    '#4ade80',
    '#22d3ee',
    '#f87171',
    '#facc15',
    '#a78bfa',
    '#34d399',
];

const UserGroup: React.FC<UserGroupProps> = ({ group, flipped, isLeader, currentPlayerId, ownerId, onKick, onTransfer }) => (
    <div
        role="region"
        aria-label="Participantes da votacao"
        style={{
            width: '100%',
            flex: '1 1 0',
            minHeight: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
        }}
    >
        <Row justify="center" align="middle">
            {group.map((user, idx) => {
                const isSelf = user.id === currentPlayerId;
                const isUserOwner = user.id === ownerId;
                return (
                    <Col
                        key={user.id}
                        className="card-deal"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            animationDelay: `${idx * 80}ms`,
                        }}
                    >
                        <UserCard
                            flipped={user.hasVoted && flipped}
                            revealDelay={flipped ? idx * 150 : 0}
                            username={user.username}
                            hasVoted={user.hasVoted}
                            vote={user.vote}
                            connected={user.connected}
                            color={CARD_PALETTE[idx % CARD_PALETTE.length]}
                            isOwner={isUserOwner}
                            canKick={isLeader && !isSelf}
                            onKick={() => onKick(user.id)}
                            canTransfer={isLeader && !isSelf && user.connected}
                            onTransfer={() => onTransfer(user.id)}
                        />
                    </Col>
                );
            })}
        </Row>
    </div>
);

export default UserGroup;
export type { User };