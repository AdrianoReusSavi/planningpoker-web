import { Col, Row } from "antd";
import ActionCard from "../cards/ActionCard";

interface VotingDeckProps {
    votingDeck: string[];
    vote: string;
    setVote: (value: string) => void;
    flipped: boolean;
}

const VotingDeck: React.FC<VotingDeckProps> = ({ votingDeck, vote, setVote, flipped }) => (
    <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px var(--shadow-color)',
    }}>
        <Row justify="center" align="middle" style={{ flexWrap: 'wrap', gap: '4px 0' }}>
            {votingDeck.map((card) => (
                <Col key={card} style={{ display: 'flex', justifyContent: 'center' }}>
                    <ActionCard value={card} vote={vote} setVote={setVote} disabled={flipped} />
                </Col>
            ))}
        </Row>
    </div>
);

export default VotingDeck;