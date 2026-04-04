import { CoffeeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

interface ReactionBarProps {
    onReact: (emoji: string) => void;
    onBreak: () => void;
}

const REACTIONS = ["👍", "👎", "🤔", "🎉", "❓", "😂", "🔥"];

const emojiButtonStyle: React.CSSProperties = {
    fontSize: '20px',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '8px',
    transition: 'transform 0.15s',
    userSelect: 'none',
};

const ReactionBar: React.FC<ReactionBarProps> = ({ onReact, onBreak }) => (
    <div style={{
        display: 'flex',
        gap: '4px',
        padding: '6px 12px',
        background: 'var(--bg-secondary)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        alignItems: 'center',
    }}>
        {REACTIONS.map(emoji => (
            <div
                key={emoji}
                role="button"
                tabIndex={0}
                aria-label={`Reagir com ${emoji}`}
                onClick={() => onReact(emoji)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onReact(emoji); } }}
                style={emojiButtonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
                {emoji}
            </div>
        ))}

        <div style={{
            width: '1px',
            height: '20px',
            background: 'var(--border-color)',
            margin: '0 4px',
        }} />

        <Tooltip title="Pedir pausa para cafe">
            <div
                role="button"
                tabIndex={0}
                aria-label="Pedir pausa para cafe"
                onClick={onBreak}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBreak(); } }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = '#a78bfa';
                    e.currentTarget.style.color = '#7c3aed';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }}
            >
                <CoffeeOutlined style={{ fontSize: 18 }} /> Cafe
            </div>
        </Tooltip>
    </div>
);

export default ReactionBar;