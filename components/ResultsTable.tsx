import React from 'react';
import type { Cut } from '../types';

interface ResultsTableProps {
  results: Cut[];
  startCutNumber: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, startCutNumber }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider w-16">
              컷 #
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
              장소
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
              인물 수
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
              대사
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
              영화 컷
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
              상황
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {results.map((cut, index) => (
            <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                {startCutNumber + index}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {cut.place}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                {cut.characterCount}
                {cut.characterCount > 0 && cut.characterCount <= 4 && cut.characters && cut.characters.length > 0 && (
                  <>
                    <br />
                    <span className="text-xs text-gray-400">({cut.characters.join(', ')})</span>
                  </>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 min-w-[15rem]">
                {cut.dialogue}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {cut.shot}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 min-w-[20rem]">
                {cut.situation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};