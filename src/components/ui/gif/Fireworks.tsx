import { useEffect, useMemo, useState } from 'react';

let idCounter = 0;

type Particle = {
    id: number;
    top: string;
    left: string;
    dx: number;
    dy: number;
    dz: number;
    color: string;
};

function generateExplosions(n: number, minDist = 20) {
  const points: { top: number; left: number }[] = [];

  function distance(a: { top: number; left: number }, b: { top: number; left: number }) {
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    return Math.sqrt(dx * dx + dy * dy);
  }

  while (points.length < n) {
    const candidate = {
      top: Math.random() * 60 + 20,
      left: Math.random() * 60 + 20
    };

    if (points.every(p => distance(p, candidate) >= minDist)) {
      points.push(candidate);
    }
  }

  return points.map(p => ({
    top: `${p.top}%`,
    left: `${p.left}%`
  }));
}

const colorGroups = [
  ['#E40303', '#FF8C00', '#FFED00', '#008026', '#004DFF', '#750787'],
  ['#D60270', '#9B4F96', '#0038A8'],
  ['#FF218C', '#FFD800', '#21B1FF'],
  ['#D62E00', '#FF9A56', '#FFFFFF', '#D362A4', '#A60061'],
  ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
  ['#000000', '#A3A3A3', '#FFFFFF', '#800080'],
  ['#FFF430', '#FFFFFF', '#9C59D1', '#000000'],
];

function pickColors(group: string[], count = 5) {
  const shuffled = [...group].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const Fireworks = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const explosionPoints = useMemo(() => generateExplosions(5, 20), []);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index >= explosionPoints.length) {
                clearInterval(interval);
                return;
            }

            const { top, left } = explosionPoints[index];
            explode(top, left, index);
            index++;
        }, 1000);

        return () => clearInterval(interval);
    }, [explosionPoints]);

    const explode = (top: string, left: string, groupIndex: number) => {
        const particleCount = 60;
        const colors = pickColors(colorGroups[groupIndex] || colorGroups[0], 5);

        const newParticles = Array.from({ length: particleCount }, () => {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 100 + 50;
            const deg = angle * (180 / Math.PI);
            const color = colors[Math.floor(Math.random() * colors.length)];

            return {
                id: idCounter++,
                top,
                left,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                dz: deg,
                color
            };
        });

        setParticles(prev => [...prev, ...newParticles]);

        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 2000);
    };

    return (
        <div className="fireworks">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        background: p.color,
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                        '--dz': `${p.dz}deg`
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};