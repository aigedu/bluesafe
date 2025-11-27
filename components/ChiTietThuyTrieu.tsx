
import React from 'react';
import type { VungCanhBao } from '../types';
import { MucDoCanhBao } from '../types';
import { WaterLevelIcon, ClockIcon } from './Icons';

interface ChiTietThuyTrieuProps {
  vung: VungCanhBao;
}

const layThongTinCanhBao = (muc: MucDoCanhBao): { mau: string, text: string, bg: string, border: string } => {
  switch (muc) {
    case MucDoCanhBao.AN_TOAN: return { mau: 'text-green-700', text: 'An Toàn', bg: 'bg-green-50', border: 'border-green-200' };
    case MucDoCanhBao.THAP: return { mau: 'text-yellow-700', text: 'Cảnh Báo Thấp', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    case MucDoCanhBao.TRUNG_BINH: return { mau: 'text-orange-700', text: 'Cảnh Báo Trung Bình', bg: 'bg-orange-50', border: 'border-orange-200' };
    case MucDoCanhBao.CAO: return { mau: 'text-red-700', text: 'Cảnh Báo Cao', bg: 'bg-red-50', border: 'border-red-200' };
    case MucDoCanhBao.NGUY_HIEM: return { mau: 'text-purple-700', text: 'Nguy Hiểm', bg: 'bg-purple-50', border: 'border-purple-200' };
    default: return { mau: 'text-gray-700', text: 'Không xác định', bg: 'bg-gray-50', border: 'border-gray-200' };
  }
};


export const ChiTietThuyTrieu: React.FC<ChiTietThuyTrieuProps> = ({ vung }) => {
  const { mau, text, bg, border } = layThongTinCanhBao(vung.mucCanhBao);

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">{vung.ten}</h2>
      
      <div className={`${bg} border ${border} rounded-lg p-4`}>
        <div className="flex items-center">
          <WaterLevelIcon className="h-10 w-10 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Mực nước hiện tại</p>
            <p className="text-3xl font-bold text-blue-700">{vung.mucNuocHienTai.toFixed(2)} m</p>
          </div>
        </div>
        <p className={`mt-2 text-lg font-semibold ${mau}`}>{text}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-500"/>
          Dự báo trong các giờ tới
        </h3>
        <ul className="space-y-2">
          {vung.duBao.map((db, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
              <span className="text-gray-600">
                {new Date(db.thoiGian).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="font-semibold text-gray-800">{db.mucNuoc.toFixed(2)} m</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
