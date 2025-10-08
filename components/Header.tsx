
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-12">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#f0e6d8] text-xs font-medium text-[#b58b72]">
          소설을 영화처럼
        </div>
        <h1 className="text-4xl font-semibold text-[#44352d]">
          소설 씬 분리기에 다시 오셨네요!
        </h1>
        <p className="text-sm text-[#8f7c6c]">
          오늘은 어떤 이야기의 장면을 정리해 드릴까요?
        </p>
      </div>
    </header>
  );
};
