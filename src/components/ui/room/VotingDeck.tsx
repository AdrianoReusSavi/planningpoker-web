import { Col, Row } from "antd";
import ActionCard from "../cards/ActionCard";

interface VotingDeckProps {
    votingDeck: string[];
    vote: string;
    setVote: React.Dispatch<React.SetStateAction<string>>;
    flipped: boolean;
}

const VotingDeck: React.FC<VotingDeckProps> = ({ votingDeck, vote, setVote, flipped }) => (
    <div
        style={{
            width: "100%",
            height: "25%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Row justify="center">
            {votingDeck.map((card) => (
                <Col key={card} style={{ display: "flex", justifyContent: "center" }}>
                    <ActionCard value={card} vote={vote} setVote={setVote} disabled={flipped} />
                </Col>
            ))}
        </Row>
    </div>
);

export default VotingDeck;