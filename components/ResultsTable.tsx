import React from 'react';
import type { Cut } from '../types';

interface ResultsTableProps {
  results: Cut[];
  startCutNumber: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, startCutNumber }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#ead9c5] bg-white/90">
      <table className="min-w-full divide-y divide-[#f0e6d8]">
        <thead className="bg-[#f9f2ea]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#b6846b] tracking-wide w-16">
              컷 #
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#b6846b] tracking-wide">
              장소
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#b6846b] tracking-wide">
              인물 수
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#b6846b] tracking-wide">
              대사
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#b6846b] tracking-wide">
              영화 컷
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#b6846b] tracking-wide">
              상황
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#f0e6d8]">
          {results.map((cut, index) => (
            <tr key={index} className="hover:bg-[#fdf6ef] transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#775f51]">
                {startCutNumber + index}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d4a3f]">
                {cut.place}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d4a3f] text-center">
                {cut.characterCount}
                {cut.characterCount > 0 && cut.characterCount <= 4 && cut.characters && cut.characters.length > 0 && (
                  <>
                    <br />
                    <span className="text-xs text-[#a18c78]">({cut.characters.join(', ')})</span>
                  </>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-[#5d4a3f] min-w-[15rem] leading-relaxed">
                {cut.dialogue}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d4a3f]">
                {cut.shot}
              </td>
              <td className="px-6 py-4 text-sm text-[#5d4a3f] min-w-[20rem] leading-relaxed">
                {cut.situation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
