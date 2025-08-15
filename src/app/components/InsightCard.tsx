// app/components/InsightCard.tsx
import { FC, ReactElement } from 'react';

interface InsightCardProps {
    title: string;
    insight: string;
    description: string;
    icon: ReactElement;
}

export const InsightCard: FC<InsightCardProps> = ({ title, insight, description, icon }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
        <div className="flex items-center gap-4">
            <div className="text-blue-500">{icon}</div>
            <div>
                <p className="font-bold">{title}: <span className="text-blue-900">{insight}</span></p>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    </div>
);