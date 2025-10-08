
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          소설 씬 분리기 (Novel Scene Splitter)
        </h1>
        <p className="text-center text-gray-400 mt-1">AI를 이용해 소설 텍스트를 영화 씬으로 자동 분리 및 분석합니다.</p>
      </div>
    </header>
  );
};
