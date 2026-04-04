import { useState } from "react";

interface ActionCardProps {
    value: string;
    vote: string;
    setVote: (value: string) => void;
    disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ value, vote, setVote, disabled }) => {
    const isSelected = value === vote;
    const [hovered, setHovered] = useState(false);

    const handleSelect = () => {
        if (!disabled) setVote(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            setVote(value);
        }
    };

    const cornerStyle: React.CSSProperties = {
        position: 'absolute',
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: 1,
        color: isSelected ? 'rgba(255,255,255,0.75)' : '#94a3b8',
    };

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-pressed={isSelected}
            aria-disabled={disabled}
            aria-label={`Votar ${value}${isSelected ? ' (selecionado)' : ''}`}
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => !disabled && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => !disabled && setHovered(true)}
            onBlur={() => setHovered(false)}
            style={{
                position: 'relative',
                width: '64px',
                height: '92px',
                borderRadius: '10px',
                border: isSelected ? '2px solid #4f46e5' : '2px solid #e2e8f0',
                background: isSelected
                    ? 'linear-gradient(145deg, #4f46e5 0%, #7c3aed 100%)'
                    : '#ffffff',
                boxShadow: isSelected
                    ? '0 8px 20px rgba(79,70,229,0.45)'
                    : hovered
                    ? '0 6px 16px rgba(0,0,0,0.14)'
                    : '0 2px 6px rgba(0,0,0,0.07)',
                transform: isSelected
                    ? 'translateY(-14px)'
                    : hovered
                    ? 'translateY(-8px)'
                    : 'translateY(0)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled && !isSelected ? 0.4 : 1,
                userSelect: 'none',
                margin: '0 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                touchAction: 'manipulation',
                outline: 'none',
            }}
        >
            <span aria-hidden="true" style={{ ...cornerStyle, top: '7px', left: '8px' }}>{value}</span>

            <span style={{
                fontSize: '24px',
                fontWeight: 800,
                color: isSelected ? '#ffffff' : '#1e293b',
                letterSpacing: '-0.5px',
            }}>
                {value}
            </span>

            <span aria-hidden="true" style={{ ...cornerStyle, bottom: '7px', right: '8px', transform: 'rotate(180deg)' }}>
                {value}
            </span>
        </div>
    );
};

export default ActionCard;