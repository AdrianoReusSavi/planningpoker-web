import { Row, Col } from 'antd';
import UserCard from '../ui/UserCard';

interface RoomPanelMiddleProps {
    usersInRoom: string[];
    votos: Record<string, string>;
    votosRevelados: boolean;
    username: string;
    connection?: signalR.HubConnection;
    roomId: string;
}

const RoomPanelMiddle: React.FC<RoomPanelMiddleProps> = ({
    usersInRoom,
    votos,
    votosRevelados,
    username
}) => {

    return (
        <>
            <Row gutter={[16, 16]} justify="center">
                {usersInRoom.map((user) => (
                    <Col xs={24} sm={12} md={3} lg={3} xl={3} key={user}>
                        <UserCard
                            votos={votos}
                            votosRevelados={votosRevelados}
                            username={username}
                            user={user}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default RoomPanelMiddle;