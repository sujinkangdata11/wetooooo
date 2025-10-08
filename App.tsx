import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CharacterInput } from './components/CharacterInput';
import { SceneConfig } from './components/SceneConfig';
import { ResultsTable } from './components/ResultsTable';
import { Loader } from './components/Loader';
import { Sidebar, type SidebarTab } from './components/Sidebar';
import { ApiKeyPanel } from './components/ApiKeyPanel';
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
  const [activeTab, setActiveTab] = useState<SidebarTab>('input');
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

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'input':
        return (
          <section className="rounded-3xl bg-white/80 border border-[#f0e6d8] px-6 py-8 text-center">
            <h2 className="text-xl font-semibold text-[#a0725b] mb-4">캐릭터 생성</h2>
            <p className="text-sm text-[#7c6a5d] leading-relaxed">
              캐릭터 분석 기능은 준비 중입니다. 먼저 씬 생성 메뉴에서 소설 텍스트를 입력하고 컷 구성을 진행해 주세요.
            </p>
          </section>
        );
      case 'scene':
        return (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <section className="flex-1 rounded-3xl bg-white/80 border border-[#f0e6d8] backdrop-blur-sm">
                <CharacterInput inputText={inputText} setInputText={setInputText} isLoading={isLoading} />
              </section>
              <section className="flex-1 rounded-3xl bg-white/80 border border-[#f0e6d8] backdrop-blur-sm">
                <SceneConfig
                  totalCuts={totalCuts}
                  setTotalCuts={setTotalCuts}
                  partCuts={partCuts}
                  setPartCuts={setPartCuts}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  hasApiKey={Boolean(apiKey.trim())}
                  hasInputText={Boolean(inputText.trim())}
                />
              </section>
            </div>
            {isLoading && (
              <section className="rounded-3xl bg-white/60 border border-[#f0e6d8] px-8 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader />
                  <p className="text-base text-[#a0725b]">
                    AI가 소설 전체를 분석하고 있습니다... 잠시만 기다려주세요.
                  </p>
                </div>
              </section>
            )}
            {error && (
              <section className="rounded-2xl border border-[#f6d7d3] bg-[#fef1ef] px-6 py-4 text-[#a65646]">
                <p className="font-semibold">오류가 발생했어요</p>
                <p className="text-sm mt-1">{error}</p>
              </section>
            )}
            {!isLoading && !error && Object.keys(results).length > 0 && (
              <section className="rounded-3xl bg-white/80 border border-[#f0e6d8] px-6 py-8 space-y-10">
                {renderResults()}
                <div className="rounded-2xl border border-[#dbe6cf] bg-[#f5f9ed] px-6 py-5 text-[#5b7b4c] text-center">
                  <p className="font-semibold">분석 완료!</p>
                  <p className="text-sm mt-1">소설의 모든 부분이 성공적으로 분석되었습니다.</p>
                </div>
              </section>
            )}
          </div>
        );
      case 'results':
        return (
          <section className="rounded-3xl bg-white/80 border border-[#f0e6d8] px-6 py-8 text-center">
            <h2 className="text-xl font-semibold text-[#a0725b] mb-4">웹툰 생성</h2>
            <p className="text-sm text-[#7c6a5d] leading-relaxed">
              웹툰 전용 생성 기능은 준비 중입니다. 씬 생성 결과는 ‘씬 생성’ 메뉴에서 확인할 수 있어요.
            </p>
          </section>
        );
      case 'api':
        return (
          <section className="rounded-3xl bg-white/60 border border-[#f0e6d8] px-6 py-6">
            <h2 className="text-xl font-semibold text-[#a0725b] mb-4">API 입력</h2>
            <ApiKeyPanel apiKey={apiKey} setApiKey={setApiKey} isLoading={isLoading} />
            <ul className="mt-4 space-y-2 text-sm text-[#7c6a5d] leading-relaxed">
              <li>• Gemini API 키는 브라우저 로컬 저장소에만 저장되며, 언제든지 비워 재설정할 수 있습니다.</li>
              <li>• 키를 변경하면 새로 입력한 값으로 즉시 요청을 보냅니다.</li>
              <li>• 키를 발급받았다면 입력란에 붙여넣고 저장하세요.</li>
            </ul>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f3e8] text-[#4a4036] font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar activeTab={activeTab} onSelect={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="w-full max-w-6xl mx-auto px-4 pb-16 space-y-10">
            {renderActiveContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
