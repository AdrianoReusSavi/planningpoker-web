import { Button } from "antd";

interface ControlButtonsProps {
    isLeader: boolean;
    flipped: boolean;
    allVoted: boolean;
    revealVotes: () => void;
    resetVotes: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ isLeader, flipped, allVoted, revealVotes, resetVotes }) => (
    <div style={{ display: "flex" }}>
        <Button
            color="purple"
            variant="outlined"
            onClick={revealVotes}
            disabled={!isLeader || flipped || !allVoted}
            style={{ marginRight: "20px" }}
        >
            Revelar votos
        </Button>
        <Button color="pink" variant="outlined" onClick={resetVotes} disabled={!isLeader || !flipped}>
            Resetar votos
        </Button>
    </div>
);

export default ControlButtons;