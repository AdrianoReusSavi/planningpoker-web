import { Card } from "antd";

interface ActionCardProps {
    value: string;
    vote: string;
    setVote: (valor: string) => void;
    disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ value, vote, setVote, disabled }) => {
    const isSelected = value === vote;

    const handleClick = () => {
        if (disabled) return;
        setVote(value);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    };

    return (
        <div>
            <Card
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '40px',
                    height: '60px',
                    margin: '10px',
                    border: isSelected ? '1px solid #2f9bda' : '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: isSelected ? '0 4px 12px rgba(47, 155, 218, 0.4)' : '0 2px 5px rgba(0,0,0,0.05)',
                    transform: isSelected ? 'translateY(-10px)' : 'translateY(0)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    cursor: 'pointer'
                }}
            >
                <div style={{ fontSize: "16px" }}>{value}</div>
            </Card>
        </div>
    );
}

export default ActionCard;