import React, { useState, useEffect } from 'react';
import type { BaoCaoKhanCap, ToaDo } from '../types';
import { useViTri } from '../hooks/useViTri';
import { WarningIcon, LocationIcon } from './Icons';

interface ModalKhanCapProps {
  isOpen: boolean;
  onClose: () => void;
  onGuiBaoCao: (baoCao: Omit<BaoCaoKhanCap, 'id' | 'thoiGianGui'>) => Promise<void>;
  pickedLocation: ToaDo | null;
  onPickLocation: () => void;
  onClearPickedLocation: () => void;
}

export const ModalKhanCap: React.FC<ModalKhanCapProps> = ({ isOpen, onClose, onGuiBaoCao, pickedLocation, onPickLocation, onClearPickedLocation }) => {
  const [moTa, setMoTa] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const { viTri, dangLayViTri, layViTriHienTai, loiViTri } = useViTri();

  useEffect(() => {
    if (isOpen) {
      // Tự động lấy vị trí khi mở modal, nhưng chỉ khi chưa có vị trí nào được chọn từ bản đồ
      if (!pickedLocation) {
        layViTriHienTai();
      }
      // Reset form
      setMoTa('');
      setDangGui(false);
    }
  }, [isOpen, pickedLocation, layViTriHienTai]);

  const xuLySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moTa.trim()) {
      alert('Vui lòng nhập mô tả tình hình.');
      return;
    }

    const finalLocation = pickedLocation || viTri;
    
    if (!finalLocation) {
      alert('Không thể xác định vị trí của bạn. Vui lòng bật GPS, cho phép truy cập, hoặc chọn một vị trí trên bản đồ.');
      return;
    }

    setDangGui(true);
    
    const baoCaoMoi = {
      toaDo: finalLocation,
      moTa,
    };

    await onGuiBaoCao(baoCaoMoi);
    // onGuiBaoCao sẽ đóng modal sau khi thành công
  };

  if (!isOpen) {
    return null;
  }

  const hasLocation = !!pickedLocation || !!viTri;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-11/12 max-w-md">
        <div className="flex flex-col items-center text-center">
            <WarningIcon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Báo Cáo Tình Huống Khẩn Cấp</h2>
            <p className="text-gray-600 mt-2">Chỉ sử dụng trong trường hợp bạn hoặc người khác cần sự trợ giúp ngay lập tức. Báo cáo sẽ được gửi đến đội cứu hộ.</p>
        </div>
        
        <form onSubmit={xuLySubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="moTaKhanCap" className="block text-sm font-medium text-gray-700">Mô tả tình hình *</label>
            <textarea
              id="moTaKhanCap"
              rows={3}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Ví dụ: Bị kẹt ở địa chỉ X, nước dâng cao, cần di tản..."
              required
            />
          </div>

          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center">
                <LocationIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                <div className="text-sm w-full">
                    {pickedLocation && <p className="text-green-600 font-medium">✓ Vị trí đã chọn trên bản đồ.</p>}
                    {!pickedLocation && dangLayViTri && <p className="text-blue-600 font-medium">Đang lấy vị trí của bạn...</p>}
                    {!pickedLocation && loiViTri && <p className="text-red-500 font-medium">{loiViTri}</p>}
                    {!pickedLocation && viTri && <p className="text-green-600 font-medium">✓ Vị trí GPS đã được ghi nhận.</p>}
                </div>
            </div>
             <div className="flex gap-4 mt-2 pt-2 border-t border-gray-200">
                <button type="button" onClick={onPickLocation} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors w-full text-center">
                    {pickedLocation ? 'Chọn lại trên bản đồ' : 'Chọn trên bản đồ'}
                </button>
                {pickedLocation && (
                    <button type="button" onClick={() => { onClearPickedLocation(); layViTriHienTai(); }} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors w-full text-center">
                        Dùng vị trí GPS
                    </button>
                )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button 
                type="button" 
                onClick={onClose} 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
                type="submit" 
                disabled={dangGui || !hasLocation || (!pickedLocation && dangLayViTri)} 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {dangGui ? 'Đang gửi...' : 'Gửi Báo Cáo Khẩn Cấp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};