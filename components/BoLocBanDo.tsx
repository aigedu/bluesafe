import React, { useState, useEffect } from 'react';
import { LayersIcon, MyLocationIcon, BellIcon } from './Icons';
import { useViTri } from '../hooks/useViTri';
import { useNotifications } from '../hooks/useNotifications';
import type { ToaDo } from '../types';


interface Filters {
  showWarnings: boolean;
  showReports: boolean;
}

interface BoLocBanDoProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  onGoToMyLocation: (location: ToaDo) => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => {
  return (
    <label htmlFor={label} className="flex items-center cursor-pointer">
      <div className="relative">
        <input id={label} type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-full' : ''}`}></div>
      </div>
      <div className="ml-3 text-gray-700 font-medium text-sm">
        {label}
      </div>
    </label>
  );
};

export const BoLocBanDo: React.FC<BoLocBanDoProps> = ({ filters, onFilterChange, onGoToMyLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { dangLayViTri, layViTriHienTai, loiViTri } = useViTri();
  const { permission, requestPermission } = useNotifications();

  useEffect(() => {
    if (loiViTri) {
      alert(loiViTri);
    }
  }, [loiViTri]);

  const handleMyLocationClick = () => {
    layViTriHienTai((location) => {
      onGoToMyLocation(location);
    });
  };

  const handleEnableNotifications = async () => {
    const status = await requestPermission();
    if (status === 'granted') {
        alert('Đã bật thông báo thành công!');
    } else if (status === 'denied') {
        alert('Bạn đã chặn quyền nhận thông báo. Vui lòng thay đổi trong cài đặt trình duyệt.');
    }
  };

  const getNotificationButtonText = () => {
    switch (permission) {
      case 'granted':
        return '✓ Thông báo đã bật';
      case 'denied':
        return 'Thông báo đã bị chặn';
      default:
        return 'Bật thông báo đẩy';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-y-2">
       {/* Container cho các nút điều khiển */}
      <div className="flex flex-col gap-2 items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Mở bộ lọc bản đồ"
        >
          <LayersIcon className="w-6 h-6 text-gray-700" />
        </button>

         <button
            onClick={handleMyLocationClick}
            disabled={dangLayViTri}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-wait"
            aria-label="Đi đến vị trí của tôi"
        >
            <MyLocationIcon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 w-60 animate-fade-in-down">
          <h3 className="font-bold text-md mb-3 text-gray-800">Hiển thị trên bản đồ</h3>
          <div className="space-y-3">
             <ToggleSwitch 
                label="Vùng Cảnh Báo" 
                enabled={filters.showWarnings}
                onChange={(enabled) => onFilterChange({ showWarnings: enabled })} 
            />
            <ToggleSwitch 
                label="Đóng Góp CĐ" 
                enabled={filters.showReports}
                onChange={(enabled) => onFilterChange({ showReports: enabled })}
            />
          </div>
          <div className="border-t my-4"></div>
          <h3 className="font-bold text-md mb-2 text-gray-800">Cài đặt</h3>
          <button 
            onClick={handleEnableNotifications} 
            disabled={permission !== 'default'}
            className="w-full flex items-center justify-start text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-70 disabled:hover:bg-transparent disabled:cursor-default"
          >
            <BellIcon className={`w-5 h-5 mr-2 ${permission === 'granted' ? 'text-green-500' : 'text-gray-500'}`} />
            <span className="font-medium text-gray-700">{getNotificationButtonText()}</span>
          </button>
        </div>
      )}
    </div>
  );
};