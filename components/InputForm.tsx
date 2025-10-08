
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { DocumentIcon } from './icons/DocumentIcon';
import type { StoryPart } from '../types';

interface InputFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  totalCuts: number;
  setTotalCuts: (count: number) => void;
  partCuts: Record<StoryPart, number>;
  setPartCuts: (parts: Record<StoryPart, number>) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputText,
  setInputText,
  totalCuts,
  setTotalCuts,
  partCuts,
  setPartCuts,
  onGenerate,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sumOfParts, setSumOfParts] = useState(totalCuts);
  const [isSumMismatch, setIsSumMismatch] = useState(false);

  useEffect(() => {
    // FIX: Explicitly type the accumulator and value in the reduce function to resolve TypeScript error.
    const currentSum = Object.values(partCuts).reduce((acc: number, count: number) => acc + (count || 0), 0);
    setSumOfParts(currentSum);
    setIsSumMismatch(currentSum !== totalCuts);
  }, [partCuts, totalCuts]);

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
  }

  const handlePartCutChange = (part: StoryPart, count: number) => {
    setPartCuts({
      ...partCuts,
      [part]: Math.max(0, count || 0)
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Text Input & File Upload */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="novel-text" className="block text-sm font-medium text-gray-300">
                소설 텍스트 입력
              </label>
              <span className="text-xs text-gray-400 font-mono">
                글자수 공백포함 {inputText.length.toLocaleString()}자
              </span>
            </div>
            <textarea
              id="novel-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="이곳에 소설 텍스트를 붙여넣으세요..."
              className="w-full h-64 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y text-gray-200"
              disabled={isLoading}
              aria-label="Novel text input"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-300 mb-2">
              또는 TXT 파일 업로드
            </span>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
              className="hidden"
              disabled={isLoading}
            />
            <button
              onClick={triggerFileSelect}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-600 rounded-md text-gray-400 hover:bg-gray-700 hover:border-indigo-500 hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DocumentIcon className="w-5 h-5 mr-2" />
              파일 선택 (.txt)
            </button>
          </div>
        </div>
        
        {/* Right Column: Cut Configuration */}
        <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="total-cut-count" className="block text-sm font-medium text-gray-300 mb-2">
                총 컷 수
              </label>
              <input
                id="total-cut-count"
                type="number"
                value={totalCuts}
                onChange={(e) => handleTotalCutsChange(parseInt(e.target.value))}
                min="1"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200"
                disabled={isLoading}
                aria-label="Total number of cuts"
              />
            </div>
            <div className="p-4 bg-gray-900/50 rounded-md border border-gray-700">
                <p className="block text-sm font-medium text-gray-300 mb-3">
                  기/승/전/결 컷 수 분배
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(Object.keys(partCuts) as StoryPart[]).map(part => (
                        <div key={part}>
                            <label htmlFor={`cut-count-${part}`} className="block text-xs text-center font-medium text-gray-400 mb-1">{part}</label>
                            <input
                                id={`cut-count-${part}`}
                                type="number"
                                value={partCuts[part]}
                                onChange={(e) => handlePartCutChange(part, parseInt(e.target.value))}
                                min="0"
                                className="w-full p-2 text-center bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200"
                                disabled={isLoading}
                                aria-label={`Number of cuts for ${part}`}
                            />
                        </div>
                    ))}
                </div>
                <div className={`mt-3 text-sm text-center p-2 rounded-md ${isSumMismatch ? 'bg-red-900/70 text-red-300' : 'bg-green-900/70 text-green-300'}`}>
                    합계: {sumOfParts} / {totalCuts}
                </div>
            </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isLoading || !inputText || isSumMismatch}
          className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-500/50 font-medium rounded-lg text-lg px-5 py-3 text-center transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
          aria-label={isLoading ? "Analyzing scenes" : "Generate scene breakdown"}
        >
          {isLoading ? '분석 중...' : '씬 분리 생성'}
        </button>
      </div>
    </div>
  );
};
