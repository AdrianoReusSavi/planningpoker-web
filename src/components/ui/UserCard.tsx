import { Card, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface UserCardProps {
    votos: Record<string, string>;
    votosRevelados: boolean;
    username: string;
    user: string;
}

const UserCard: React.FC<UserCardProps> = ({
    votos,
    votosRevelados,
    username,
    user
}) => {
    const hasVoted = !!votos[user];
    const vote = votos[user];
    const flipped = votosRevelados && hasVoted;

    const containerStyle: React.CSSProperties = {
        perspective: "1000px",
        width: "100px",
        height: "160px",
        margin: "10px",
        textAlign: 'center',
    };

    const flipCardStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s",
        transform: flipped ? "rotateY(180deg)" : "none",
    };

    const innerStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        position: "absolute",
        transformStyle: "preserve-3d",
    };

    const faceStyle: React.CSSProperties = {
        backfaceVisibility: "hidden",
        position: "absolute",
        width: "100%",
        height: "100%",
    };

    const backStyle: React.CSSProperties = {
        ...faceStyle,
        transform: "rotateY(180deg)",
    };

    const cardStyle = {
        textAlign: "center" as const,
        borderColor: user === username ? "#1890ff" : "#d9d9d9",
        backgroundColor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
    };

    const cardBackStyle = {
        ...cardStyle,
        background: "radial-gradient(circle, #fff 40%, #fff 70%,rgb(143, 199, 255) 100%)",
        color: "#aaa",
        fontSize: "48px",
        fontWeight: "bold",
    };

    return (
        <div style={containerStyle}>
            <Tooltip title={user}>
                <div style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100px"
                }}>
                    {user}
                </div>
            </Tooltip>
            <div style={flipCardStyle}>
                <div style={innerStyle}>
                    <div style={faceStyle}>
                        <Card hoverable style={cardBackStyle}>
                            <div style={{ fontSize: "32px", marginTop: 12 }}>
                                {hasVoted ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />}
                            </div>
                        </Card>
                    </div>
                    <div style={backStyle}>
                        <Card hoverable style={cardStyle}>
                            <div style={{ fontSize: "32px", marginTop: 12 }}>{vote}</div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;