interface User {
    connectionId: string;
    username: string;
    vote: string;
}

interface VoteSummaryProps {
    flipped: boolean;
    allVoted: boolean;
    group: User[];
}

const VoteSummary: React.FC<VoteSummaryProps> = ({ flipped, allVoted, group }) => {
    const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const votos = group
        .map((user) => parseInt(user.vote))
        .filter((v) => !isNaN(v));

    if (flipped && allVoted && votos.length > 0) {
        const media = votos.reduce((a, b) => a + b, 0) / votos.length;
        const aproximada = fibonacci.reduce((prev, curr) =>
            Math.abs(curr - media) < Math.abs(prev - media) ? curr : prev
        );

        return (
            <>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Média aproximada: {aproximada}</div>
                <div style={{ fontSize: "14px", color: "#999" }}>Média exata: {media.toFixed(2)}</div>
            </>
        );
    }
    return (
        <>
            <div style={{ fontSize: "18px", fontWeight: "bold", visibility: "hidden" }}>Placeholder</div>
            <div style={{ fontSize: "14px", visibility: "hidden" }}>Placeholder</div>
        </>
    );
};

export default VoteSummary;