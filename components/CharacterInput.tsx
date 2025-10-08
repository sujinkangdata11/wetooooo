import React, { useCallback, useRef } from 'react';
import { DocumentIcon } from './icons/DocumentIcon';

interface CharacterInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
}

export const CharacterInput: React.FC<CharacterInputProps> = ({
  inputText,
  setInputText,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="px-8 py-10 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="novel-text" className="block text-sm font-semibold text-[#6c5b4f]">
            소설 텍스트 입력
          </label>
          <span className="text-xs text-[#b09a88] font-mono">
            글자수 공백포함 {inputText.length.toLocaleString()}자
          </span>
        </div>
        <textarea
          id="novel-text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="이곳에 소설 텍스트를 붙여넣으세요..."
          className="w-full h-64 rounded-2xl border border-[#ead9c5] bg-white/90 px-4 py-3 text-sm text-[#4f4137] placeholder:text-[#c2b1a3] focus:outline-none focus:ring-2 focus:ring-[#f0c7aa] focus:border-[#f0c7aa] transition duration-200 resize-y"
          disabled={isLoading}
          aria-label="Novel text input"
        />
      </div>
      <div>
        <span className="block text-sm font-semibold text-[#6c5b4f] mb-2">
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
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d9c7b4] bg-white/70 px-4 py-3 text-sm text-[#937969] hover:border-[#e3b897] hover:bg-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentIcon className="w-5 h-5" />
          파일 선택 (.txt)
        </button>
      </div>
    </div>
  );
};
