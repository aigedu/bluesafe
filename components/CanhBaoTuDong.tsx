import React from 'react';
import type { VungCanhBao } from '../types';
import { WarningIcon } from './Icons';

interface CanhBaoTuDongProps {
  vungCanhBao: VungCanhBao[];
  onDismiss: (zoneId: string) => void;
}

export const CanhBaoTuDong: React.FC<CanhBaoTuDongProps> = ({ vungCanhBao, onDismiss }) => {
  if (vungCanhBao.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end gap-3">
      {vungCanhBao.map(vung => (
        <div key={vung.id} className="w-80 max-w-sm bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-fade-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <WarningIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-bold text-red-800">CẢNH BÁO TRIỀU CƯỜNG</p>
              <p className="mt-1 text-sm text-red-700">
                Khu vực <span className="font-semibold">{vung.ten}</span> đang ở mức <span className="font-semibold lowercase">{vung.mucCanhBao}</span>.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => onDismiss(vung.id)}
                className="inline-flex text-gray-400 hover:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Đóng"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
