import { Card, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface UserCardProps {
    flipped: boolean;
    username: string;
    vote: string;
    color: string;
}

const UserCard: React.FC<UserCardProps> = ({ flipped, username, vote, color }) => {
    const baseImgStyle = {
        position: 'absolute' as const,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backfaceVisibility: 'hidden' as const,
        userSelect: 'none' as const,
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '10px',
        }}>
            <div style={{
                fontWeight: "bold",
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "80px",
            }}>
                <Tooltip title={username}>
                    {username}
                </Tooltip>
            </div>
            <div style={{
                width: '80px',
                height: '110px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: flipped ? 'rotateY(180deg)' : 'none'
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transformStyle: 'preserve-3d'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        backfaceVisibility: 'hidden'
                    }}>
                        {vote ?
                            <CheckOutlined
                                style={{
                                    color: 'black',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: 32,
                                    zIndex: 1
                                }}
                            />
                            :
                            <CloseOutlined
                                style={{
                                    color: 'black',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: 32,
                                    zIndex: 1
                                }}
                            />
                        }
                        <svg
                            width="253"
                            height="348"
                            viewBox="0 0 253 348"
                            style={{ ...baseImgStyle, color }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="253" height="348" rx="40" fill="currentColor" />
                        </svg>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}>
                        <div style={{
                            color: 'black',
                            position: 'absolute',
                            zIndex: 1,
                            fontSize: 32,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}>
                            {vote}
                        </div>
                        <svg
                            width="253"
                            height="348"
                            viewBox="0 0 253 348"
                            style={{ ...baseImgStyle, color }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="253" height="348" rx="40" fill="none" stroke="currentColor" strokeWidth="7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserCard;