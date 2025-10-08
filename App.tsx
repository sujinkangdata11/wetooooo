import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsTable } from './components/ResultsTable';
import { Loader } from './components/Loader';
import { analyzeNovel } from './services/geminiService';
import type { Cut, StoryPart } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [totalCuts, setTotalCuts] = useState<number>(80);
  const [partCuts, setPartCuts] = useState<Record<StoryPart, number>>({
    기: 20,
    승: 20,
    전: 20,
    결: 20,
  });
  const [results, setResults] = useState<Partial<Record<StoryPart, Cut[]>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('novelSceneGeminiKey') ?? '';
      }
    } catch {
      // Access to localStorage can fail in private modes; ignore and fallback to empty string.
    }
    return '';
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      if (apiKey) {
        localStorage.setItem('novelSceneGeminiKey', apiKey);
      } else {
        localStorage.removeItem('novelSceneGeminiKey');
      }
    } catch {
      // Ignore storage errors (e.g., private browsing restrictions).
    }
  }, [apiKey]);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('소설 텍스트를 입력해주세요.');
      return;
    }
    if (!apiKey.trim()) {
      setError('Gemini API 키를 입력해주세요.');
      return;
    }
    const sumOfParts = Object.values(partCuts).reduce((acc: number, count: number) => acc + count, 0);
    if (sumOfParts !== totalCuts) {
      setError('기/승/전/결의 컷 수 합계가 총 컷 수와 일치해야 합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults({});

    try {
      const analysisResults = await analyzeNovel(inputText, partCuts, apiKey.trim());
      setResults(analysisResults);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderResults = () => {
    let cumulativeCutCount = 0;
    // Ensure a consistent order of rendering
    const parts: StoryPart[] = ['기', '승', '전', '결'];
    
    return parts.map(part => {
      const cuts = results[part];
      if (!cuts || cuts.length === 0) return null;
      
      const partCutCount = cuts.length;
      const title = `${part} (Cuts ${cumulativeCutCount + 1}-${cumulativeCutCount + partCutCount})`;
      const startCutNumber = cumulativeCutCount + 1;
      cumulativeCutCount += partCutCount;

      return (
         <div key={part} className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">{title}</h2>
            <ResultsTable results={cuts} startCutNumber={startCutNumber} />
          </div>
      )
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <InputForm
          inputText={inputText}
          setInputText={setInputText}
          totalCuts={totalCuts}
          setTotalCuts={setTotalCuts}
          partCuts={partCuts}
          setPartCuts={setPartCuts}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
        
        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <Loader />
            <p className="mt-4 text-lg text-indigo-400">AI가 소설 전체를 분석하고 있습니다... 잠시만 기다려주세요.</p>
          </div>
        )}

        {Object.keys(results).length > 0 && !isLoading && (
          <div className="mt-4">
            {renderResults()}
          </div>
        )}
        
        {error && (
          <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
            <p className="font-bold">오류</p>
            <p>{error}</p>
          </div>
        )}

        {Object.keys(results).length > 0 && !isLoading && !error && (
           <div className="mt-8 text-center p-4 bg-green-900/50 border border-green-700 text-green-300 rounded-lg">
              <p className="font-bold">분석 완료!</p>
              <p>소설의 모든 부분이 성공적으로 분석되었습니다.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
