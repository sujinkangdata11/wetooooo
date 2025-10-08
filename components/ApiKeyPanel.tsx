import React, { useState } from 'react';

interface ApiKeyPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isLoading: boolean;
}

export const ApiKeyPanel: React.FC<ApiKeyPanelProps> = ({ apiKey, setApiKey, isLoading }) => {
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="gemini-api-key" className="block text-sm font-semibold text-[#6c5b4f]">
          Gemini API 키
        </label>
        <button
          type="button"
          onClick={() => setIsApiKeyVisible((prev) => !prev)}
          className="px-3 py-2 rounded-xl border border-[#ead9c5] bg-white/80 text-xs text-[#8a6d5c] hover:bg-[#f8eee3] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label={isApiKeyVisible ? 'API 키 숨기기' : 'API 키 보기'}
        >
          {isApiKeyVisible ? '숨기기' : '보기'}
        </button>
      </div>
      <input
        id="gemini-api-key"
        type={isApiKeyVisible ? 'text' : 'password'}
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        autoComplete="off"
        placeholder="AI Studio에서 발급받은 키를 입력하세요"
        className="w-full rounded-2xl border border-[#ead9c5] bg-white/90 px-4 py-3 text-sm text-[#4f4137] placeholder:text-[#c2b1a3] focus:outline-none focus:ring-2 focus:ring-[#f0c7aa] focus:border-[#f0c7aa] transition duration-200"
        disabled={isLoading}
        aria-label="Gemini API key"
      />
      <p className="text-xs text-[#b49f8e]">
        입력한 키는 브라우저 로컬 저장소에만 저장되며 다른 곳으로 전송되지 않습니다.
      </p>
    </div>
  );
};
