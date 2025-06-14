import { Card, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface UserCardProps {
    flipped: boolean;
    username: string;
    vote: string;
    color: string;
}

const UserCard: React.FC<UserCardProps> = ({ flipped, username, vote, color }) => {
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
                        <Card style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '80px',
                            height: '110px',
                            fontSize: '32px',
                            border: `1.5px solid ${color}`,
                            boxShadow: `0 2px 5px ${color}`
                        }}>
                            {vote ?
                                <CheckOutlined style={{ color: 'green' }} /> :
                                <CloseOutlined style={{ color: 'red' }} />
                            }
                        </Card>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}>
                        <Card style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '80px',
                            height: '110px',
                            border: `1.5px solid ${color}`,
                            boxShadow: `0 2px 5px ${color}`
                        }}>
                            <div style={{ fontSize: "32px" }}>{vote}</div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserCard;