
import React from 'react';
import { WaveIcon } from './Icons';

interface HeaderProps {
  onBaoCaoKhanCap: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBaoCaoKhanCap }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <WaveIcon className="h-8 w-8 mr-3" />
        <h1 className="text-xl font-bold">Cảnh Báo Triều Cường</h1>
      </div>
      <button 
        onClick={onBaoCaoKhanCap}
        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md animate-pulse"
      >
        Báo Cáo Khẩn Cấp
      </button>
    </header>
  );
};
