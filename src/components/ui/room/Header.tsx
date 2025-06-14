import { Button } from "antd";
import Title from "antd/es/typography/Title";

interface HeaderProps {
  roomName: string;
  roomId: string;
  copiarLink: () => void;
  leaveRoom: () => void;
}

const Header: React.FC<HeaderProps> = ({ roomName, roomId, copiarLink, leaveRoom }) => (
  <div
    style={{
      width: "100%",
      height: "10%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Title level={3} style={{ margin: 0, marginLeft: "20px" }}>
      {roomName}
    </Title>
    <div style={{ marginRight: "20px" }}>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          const url = `${window.location.origin}?roomId=${encodeURIComponent(roomId)}`;
          navigator.clipboard.writeText(url);
          copiarLink();
        }}
        style={{ marginRight: "20px" }}
      >
        Convidar participantes
      </Button>
      <Button color="danger" variant="outlined" onClick={leaveRoom}>
        Sair da sala
      </Button>
    </div>
  </div>
);

export default Header;