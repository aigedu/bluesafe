
import React from 'react';
import type { BaoCaoNguoiDung } from '../types';
import { UserIcon, TimeIcon } from './Icons';

interface DanhSachBaoCaoProps {
  cacBaoCao: BaoCaoNguoiDung[];
}

const formatThoiGian = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleTimeString('vi-VN')} ${date.toLocaleDateString('vi-VN')}`;
}

export const DanhSachBaoCao: React.FC<DanhSachBaoCaoProps> = ({ cacBaoCao }) => {
  if (cacBaoCao.length === 0) {
    return <div className="text-center text-gray-500 mt-8">Chưa có báo cáo nào từ cộng đồng.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Báo cáo từ cộng đồng</h2>
      {cacBaoCao.map((baoCao) => (
        <div key={baoCao.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          {baoCao.hinhAnhUrl && (
            <img src={baoCao.hinhAnhUrl} alt="Hình ảnh báo cáo" className="rounded-lg w-full h-40 object-cover mb-3" />
          )}
          <p className="text-gray-800">{baoCao.moTa}</p>
          {baoCao.mucNuocThucTe && (
            <p className="text-sm font-medium text-blue-600 mt-1">Ước tính mực nước: {baoCao.mucNuocThucTe} m</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1.5" />
              <span>{baoCao.nguoiGui}</span>
            </div>
            <div className="flex items-center">
              <TimeIcon className="h-4 w-4 mr-1.5" />
              <span>{formatThoiGian(baoCao.thoiGianGhiNhan)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
