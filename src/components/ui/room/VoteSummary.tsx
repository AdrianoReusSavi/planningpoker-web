import estimationOptions from '../../../constants/estimationOptions';

interface User {
    connectionId: string;
    username: string;
    vote: string;
}

interface VoteSummaryProps {
    flipped: boolean;
    allVoted: boolean;
    group: User[];
    votingDeck: string[];
}

const VoteSummary: React.FC<VoteSummaryProps> = ({ flipped, allVoted, group, votingDeck }) => {
    const numeros = votingDeck.map(Number).filter((n: number) => !isNaN(n));
    const votosNumericos = group.map((user) => parseFloat(user.vote)).filter((v) => !isNaN(v));
    const votosTextuais = group.map((user) => user.vote).filter((v) => v && isNaN(Number(v)));

    if (flipped && allVoted) {
        if (votosNumericos.length > 0 && numeros.length > 0) {
            const media = votosNumericos.reduce((a, b) => a + b, 0) / votosNumericos.length;
            const aproximada = numeros.reduce((prev: number, curr: number) =>
                Math.abs(curr - media) < Math.abs(prev - media) ? curr : prev
            );

            return (
                <>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>Média aproximada: {aproximada}</div>
                    <div style={{ fontSize: "14px", color: "#999" }}>Média exata: {media.toFixed(2)}</div>
                </>
            );
        } else if (votosTextuais.length > 0) {
            const contagem: Record<string, number> = {};
            votosTextuais.forEach(v => contagem[v] = (contagem[v] || 0) + 1);
            const entradas = Object.entries(contagem);
            const maisComum = entradas.sort((a, b) => b[1] - a[1])[0];
            const todasEmpatadas = entradas.every(e => e[1] === 1);

            const sorted = [...votosTextuais].sort((a, b) => votingDeck.indexOf(a) - votingDeck.indexOf(b));
            const mediana = sorted[Math.floor(sorted.length / 2)];

            return (
                <>
                    {!todasEmpatadas ? (
                        <>
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Mais votado: {maisComum[0]}</div>
                            <div style={{ fontSize: "14px", color: "#999" }}>Valor central: {mediana}</div>
                        </>
                    ) : (
                        <div style={{ fontSize: "18px", fontWeight: "bold" }}>Valor central: {mediana}</div>
                    )}
                </>
            );
        }
    }

    return (
        <>
            <div style={{ fontSize: "18px", fontWeight: "bold", visibility: "hidden" }}>Placeholder</div>
            <div style={{ fontSize: "14px", visibility: "hidden" }}>Placeholder</div>
        </>
    );
};

export default VoteSummary;