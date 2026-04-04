import { Tooltip } from "antd";
import { CheckOutlined, CloseOutlined, CrownOutlined } from '@ant-design/icons';

interface UserCardProps {
    flipped: boolean;
    revealDelay?: number;
    username: string;
    hasVoted: boolean;
    vote: string;
    connected: boolean;
    color: string;
    isOwner?: boolean;
    canKick?: boolean;
    onKick?: () => void;
    canTransfer?: boolean;
    onTransfer?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ flipped, revealDelay = 0, username, hasVoted, vote, connected, color, isOwner, canKick, onKick, canTransfer, onTransfer }) => {
    const statusText = !connected
        ? 'desconectado'
        : hasVoted
        ? 'votou'
        : 'aguardando voto';

    const faceBase: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
    };

    return (
        <div
            role="article"
            aria-label={`${username} - ${statusText}${flipped && vote ? `, voto: ${vote}` : ''}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '7px',
                margin: '8px 6px',
                position: 'relative',
            }}
        >
            {/* Transfer ownership button */}
            {canTransfer && (
                <Tooltip title={`Transferir lideranca para ${username}`}>
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={`Transferir lideranca para ${username}`}
                        onClick={(e) => { e.stopPropagation(); onTransfer?.(); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTransfer?.(); } }}
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '-6px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        <CrownOutlined style={{ color: '#fff', fontSize: 10 }} />
                    </div>
                </Tooltip>
            )}

            {/* Kick button */}
            {canKick && (
                <Tooltip title={`Remover ${username}`}>
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={`Remover ${username} da sala`}
                        onClick={(e) => { e.stopPropagation(); onKick?.(); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onKick?.(); } }}
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        <CloseOutlined style={{ color: '#fff', fontSize: 10 }} />
                    </div>
                </Tooltip>
            )}

            {/* Perspective wrapper */}
            <div style={{ perspective: '800px' }}>
                <div
                    aria-hidden="true"
                    style={{
                        width: '72px',
                        height: '104px',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transition: `transform 0.55s cubic-bezier(0.4, 0, 0.2, 1) ${revealDelay}ms`,
                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >

                    {/* Face down — card back */}
                    <div style={{
                        ...faceBase,
                        background: color,
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            rgba(255,255,255,0.07) 0px,
                            rgba(255,255,255,0.07) 2px,
                            transparent 2px,
                            transparent 14px
                        )`,
                        border: '2px solid rgba(255,255,255,0.18)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        opacity: connected ? 1 : 0.4,
                    }}>
                        {hasVoted ? (
                            <CheckOutlined style={{ color: 'rgba(255,255,255,0.95)', fontSize: 26 }} />
                        ) : (
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                border: '2px dashed rgba(255,255,255,0.45)',
                            }} />
                        )}
                    </div>

                    {/* Face up — vote value */}
                    <div style={{
                        ...faceBase,
                        background: '#ffffff',
                        border: '2px solid #e2e8f0',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: color,
                            borderRadius: '8px 8px 0 0',
                        }} />
                        <span style={{
                            fontSize: '26px',
                            fontWeight: 800,
                            color: '#1e293b',
                            letterSpacing: '-1px',
                        }}>
                            {vote}
                        </span>
                    </div>

                </div>
            </div>

            {/* Username */}
            <Tooltip title={`${username}${isOwner ? ' (lider)' : ''}`}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: connected ? '#64748b' : '#cbd5e1',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '72px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                }}>
                    {isOwner && <CrownOutlined style={{ fontSize: 10, color: '#f59e0b' }} />}
                    {username}
                </div>
            </Tooltip>
        </div>
    );
};

export default UserCard;