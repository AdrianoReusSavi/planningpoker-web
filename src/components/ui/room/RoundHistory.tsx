import { Drawer, Table, Tag } from "antd";
import type { RoundRecord } from "../../../types/room";

interface RoundHistoryProps {
    open: boolean;
    onClose: () => void;
    history: RoundRecord[];
}

const RoundHistory: React.FC<RoundHistoryProps> = ({ open, onClose, history }) => {
    return (
        <Drawer
            title="Historico de rodadas"
            placement="right"
            onClose={onClose}
            open={open}
            width={400}
        >
            {history.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Nenhuma rodada finalizada ainda.</p>
            ) : (
                [...history].reverse().map(round => {
                    const entries = Object.entries(round.votes);
                    const numericVotes = entries.map(([, v]) => parseFloat(v)).filter(n => !isNaN(n));
                    const mean = numericVotes.length > 0
                        ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
                        : null;

                    return (
                        <div key={round.round} style={{
                            marginBottom: '16px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>Rodada {round.round}</strong>
                                {mean && <Tag color="purple">Media: {mean}</Tag>}
                            </div>
                            <Table
                                dataSource={entries.map(([name, vote]) => ({ key: name, name, vote }))}
                                columns={[
                                    { title: 'Jogador', dataIndex: 'name', key: 'name' },
                                    { title: 'Voto', dataIndex: 'vote', key: 'vote', width: 80, align: 'center' as const },
                                ]}
                                pagination={false}
                                size="small"
                            />
                        </div>
                    );
                })
            )}
        </Drawer>
    );
};

export default RoundHistory;