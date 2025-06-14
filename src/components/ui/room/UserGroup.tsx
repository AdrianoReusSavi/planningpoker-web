import { Col, Row } from "antd";
import UserCard from "../cards/UserCard";

interface User {
    connectionId: string;
    username: string;
    vote: string;
}

interface UserGroupProps {
    group: User[];
    flipped: boolean;
}

const UserGroup: React.FC<UserGroupProps> = ({ group, flipped }) => {
    function getRainbowColor(index: number, total: number): string {
        const hue = (index / total) * 360;
        return `hsla(${hue}, 100%, 50%, 0.5)`;
    }

    return (
        <div
            style={{
                width: "100%",
                height: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Row justify="center">
                {group.map((user, idx) => (
                    <Col key={user.username ?? idx} style={{ display: "flex", justifyContent: "center" }}>
                        <UserCard flipped={flipped} username={user.username} vote={user.vote} color={getRainbowColor(idx, group.length)} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default UserGroup;
export type { User };