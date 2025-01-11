import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description }) => {
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getIcon = () => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (score >= 60) return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    return <XCircle className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {getIcon()}
      </div>
      <div className="mb-4">
        <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};