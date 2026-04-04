import { Button, Tooltip } from "antd";

interface ControlButtonsProps {
    isLeader: boolean;
    flipped: boolean;
    allVoted: boolean;
    someVoted: boolean;
    revealVotes: () => void;
    resetVotes: () => void;
}

function getRevealTooltip(isLeader: boolean, flipped: boolean, someVoted: boolean): string {
    if (!isLeader) return "Apenas o lider pode revelar";
    if (flipped) return "Votos ja revelados";
    if (!someVoted) return "Ninguem votou ainda";
    return "";
}

function getResetTooltip(isLeader: boolean, flipped: boolean): string {
    if (!isLeader) return "Apenas o lider pode resetar";
    if (!flipped) return "Revele os votos antes de resetar";
    return "";
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ isLeader, flipped, allVoted, someVoted, revealVotes, resetVotes }) => {
    const revealDisabled = !isLeader || flipped || !someVoted;
    const resetDisabled = !isLeader || !flipped;

    return (
        <div style={{ display: "flex" }}>
            <Tooltip title={getRevealTooltip(isLeader, flipped, someVoted)}>
                <span>
                    <Button
                        color="purple"
                        variant={allVoted ? "solid" : "outlined"}
                        onClick={revealVotes}
                        disabled={revealDisabled}
                        style={{ marginRight: "20px" }}
                    >
                        {allVoted ? "Revelar votos" : "Revelar votos parcial"}
                    </Button>
                </span>
            </Tooltip>
            <Tooltip title={getResetTooltip(isLeader, flipped)}>
                <span>
                    <Button color="pink" variant="outlined" onClick={resetVotes} disabled={resetDisabled}>
                        Resetar votos
                    </Button>
                </span>
            </Tooltip>
        </div>
    );
};

export default ControlButtons;