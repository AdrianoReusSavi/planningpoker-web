import { Button, Tag, Tooltip } from "antd";
import { ExportOutlined, HistoryOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import type { ConnectionStatus } from "../../../context/ConnectionContext";
import { useTheme } from "../../../context/ThemeContext";

interface HeaderProps {
  roomName: string;
  roomId: string;
  connectionStatus: ConnectionStatus;
  historyCount: number;
  copiarLink: () => void;
  leaveRoom: () => void;
  openHistory: () => void;
  openMiniView: () => void;
}

const statusConfig: Record<ConnectionStatus, { color: string; label: string }> = {
  connected: { color: "success", label: "Online" },
  reconnecting: { color: "warning", label: "Reconectando..." },
  disconnected: { color: "error", label: "Desconectado" },
};

const Header: React.FC<HeaderProps> = ({ roomName, roomId, connectionStatus, historyCount, copiarLink, leaveRoom, openHistory, openMiniView }) => {
  const { color, label } = statusConfig[connectionStatus];
  const { isDark, toggle } = useTheme();

  return (
    <div
      style={{
        width: "100%",
        flex: "0 0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "20px" }}>
        <Title level={3} style={{ margin: 0 }}>
          {roomName}
        </Title>
        <Tag color={color} aria-live="polite" aria-label={`Status: ${label}`}>{label}</Tag>
      </div>
      <div style={{ marginRight: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggle}
          aria-label={isDark ? "Modo claro" : "Modo escuro"}
        />
        <Button
          type="text"
          icon={<HistoryOutlined />}
          onClick={openHistory}
          aria-label="Historico de rodadas"
        >
          {historyCount > 0 && historyCount}
        </Button>
        <Tooltip title="Abrir mini painel para votar em janela separada">
          <Button
            type="text"
            icon={<ExportOutlined />}
            onClick={openMiniView}
            aria-label="Abrir painel de votacao em popup"
          />
        </Tooltip>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            const url = `${window.location.origin}?roomId=${encodeURIComponent(roomId)}`;
            navigator.clipboard.writeText(url);
            copiarLink();
          }}
        >
          Convidar
        </Button>
        <Button color="danger" variant="outlined" onClick={leaveRoom}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Header;