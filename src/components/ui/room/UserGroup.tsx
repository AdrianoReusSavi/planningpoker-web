import { Col, Row } from "antd";
import UserCard from "../cards/UserCard";

interface User {
    ConnectionId: string;
    Username: string;
    Vote: string;
    Flipped: boolean;
}

interface UserGroupProps {
    Group: User[];
    Flipped: boolean;
}

const UserGroup: React.FC<UserGroupProps> = ({ Group, Flipped }) => {
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
                {Group.map((user, idx) => (
                    <Col key={user.Username ?? idx} style={{ display: "flex", justifyContent: "center" }}>
                        <UserCard flipped={user.Flipped && Flipped} username={user.Username} vote={user.Vote} color={getRainbowColor(idx, Group.length)} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default UserGroup;
export type { User };