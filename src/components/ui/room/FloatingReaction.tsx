import { useEffect, useState } from "react";

interface Reaction {
    id: number;
    emoji: string;
    username: string;
    x: number;
}

let reactionId = 0;

interface FloatingReactionProps {
    reaction: { username: string; emoji: string } | null;
}

const FloatingReaction: React.FC<FloatingReactionProps> = ({ reaction }) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);

    useEffect(() => {
        if (!reaction) return;
        const id = ++reactionId;
        const x = 10 + Math.random() * 80; // random horizontal position (10-90% of viewport)
        setReactions(prev => [...prev, { id, emoji: reaction.emoji, username: reaction.username, x }]);

        const timer = setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id));
        }, 2000);
        return () => clearTimeout(timer);
    }, [reaction]);

    return (
        <>
            {reactions.map(r => (
                <div
                    key={r.id}
                    className="floating-reaction"
                    style={{ left: `${r.x}%`, bottom: '15%' }}
                    aria-hidden="true"
                >
                    {r.emoji}
                </div>
            ))}
        </>
    );
};

export default FloatingReaction;