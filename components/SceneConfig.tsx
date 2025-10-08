import React, { useMemo } from 'react';
import type { StoryPart } from '../types';

interface SceneConfigProps {
  totalCuts: number;
  setTotalCuts: (count: number) => void;
  partCuts: Record<StoryPart, number>;
  setPartCuts: (parts: Record<StoryPart, number>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasApiKey: boolean;
  hasInputText: boolean;
}

const PART_ORDER: StoryPart[] = ['기', '승', '전', '결'];

export const SceneConfig: React.FC<SceneConfigProps> = ({
  totalCuts,
  setTotalCuts,
  partCuts,
  setPartCuts,
  onGenerate,
  isLoading,
  hasApiKey,
  hasInputText,
}) => {
  const sumOfParts = useMemo(
    () => Object.values(partCuts).reduce((acc, count) => acc + (count || 0), 0),
    [partCuts]
  );
  const isSumMismatch = sumOfParts !== totalCuts;

  const handleTotalCutsChange = (newTotal: number) => {
    const sanitizedTotal = Math.max(1, newTotal || 1);
    setTotalCuts(sanitizedTotal);

    const base = Math.floor(sanitizedTotal / 4);
    const remainder = sanitizedTotal % 4;
    setPartCuts({
      기: base + (remainder > 0 ? 1 : 0),
      승: base + (remainder > 1 ? 1 : 0),
      전: base + (remainder > 2 ? 1 : 0),
      결: base,
    });
  };

  const handlePartCutChange = (part: StoryPart, count: number) => {
    setPartCuts({
      ...partCuts,
      [part]: Math.max(0, count || 0),
    });
  };

  return (
    <div className="px-8 py-10 space-y-6">
      <div>
        <label htmlFor="total-cut-count" className="block text-sm font-semibold text-[#6c5b4f] mb-2">
          총 컷 수
        </label>
        <input
          id="total-cut-count"
          type="number"
          value={totalCuts}
          onChange={(e) => handleTotalCutsChange(parseInt(e.target.value))}
          min="1"
          className="w-full rounded-2xl border border-[#ead9c5] bg-white/90 px-4 py-3 text-sm text-[#4f4137] focus:outline-none focus:ring-2 focus:ring-[#f0c7aa] focus:border-[#f0c7aa] transition duration-200"
          disabled={isLoading}
          aria-label="Total number of cuts"
        />
      </div>
      <div className="rounded-2xl border border-[#ead9c5] bg-white/70 px-4 py-4">
        <p className="block text-sm font-semibold text-[#6c5b4f] mb-3">
          기/승/전/결 컷 수 분배
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PART_ORDER.map((part) => (
            <div key={part}>
              <label
                htmlFor={`cut-count-${part}`}
                className="block text-xs text-center font-medium text-[#b49f8e] mb-1"
              >
                {part}
              </label>
              <input
                id={`cut-count-${part}`}
                type="number"
                value={partCuts[part]}
                onChange={(e) => handlePartCutChange(part, parseInt(e.target.value))}
                min="0"
                className="w-full rounded-2xl border border-[#ead9c5] bg-white px-3 py-2 text-center text-sm text-[#4f4137] focus:outline-none focus:ring-2 focus:ring-[#f0c7aa] focus:border-[#f0c7aa] transition duration-200"
                disabled={isLoading}
                aria-label={`Number of cuts for ${part}`}
              />
            </div>
          ))}
        </div>
        <div
          className={`mt-4 text-sm text-center rounded-2xl px-3 py-2 ${
            isSumMismatch ? 'bg-[#fef1ef] text-[#b25b47]' : 'bg-[#f5f9ed] text-[#5b7b4c]'
          }`}
        >
          합계: {sumOfParts} / {totalCuts}
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading || !hasInputText || isSumMismatch || !hasApiKey}
        className="w-full rounded-2xl bg-[#f1bba0] hover:bg-[#f0ad8a] text-[#4d3a30] font-semibold text-lg px-5 py-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#f6d5c0]/70 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isLoading ? 'Analyzing scenes' : 'Generate scene breakdown'}
      >
        {isLoading ? '분석 중...' : '씬 분리 생성'}
      </button>
    </div>
  );
};
