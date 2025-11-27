// FIX: Declare google as any to workaround missing @types/google.maps
// FIX: Declare google as any to workaround missing @types/google.maps
declare const google: any;
import React, { useState } from 'react';
import type { VungCanhBao, BaoCaoNguoiDung, TinhTrangTuyenDuong } from '../types';
import { ChiTietThuyTrieu } from './ChiTietThuyTrieu';
import { DanhSachBaoCao } from './DanhSachBaoCao';
import { FormBaoCao } from './FormBaoCao';
import { TimDuong } from './TimDuong';
import { RouteIcon } from './Icons';

interface BangDieuKhienProps {
  vungChon: VungCanhBao | null;
  cacBaoCao: BaoCaoNguoiDung[];
  onGuiBaoCao: (baoCao: Omit<BaoCaoNguoiDung, 'id' | 'thoiGianGui' | 'trangThai'>) => Promise<void>;
  onTimDuong: () => void;
  onXoaDuong: () => void;
  dangTimDuong: boolean;
  // FIX: Cannot find namespace 'google'.
  ketQuaDuong: any | null;
  tinhTrangDuong: TinhTrangTuyenDuong;
  loiTimDuong: string | null;
  originAddress: string;
  onOriginChange: (value: string) => void;
  destinationAddress: string;
  onDestinationChange: (value: string) => void;
  onSetPickingFor: (type: 'origin' | 'destination' | null) => void;
}

type Tab = 'thongtin' | 'baocao' | 'gopy' | 'timduong';

export const BangDieuKhien: React.FC<BangDieuKhienProps> = (props) => {
  const { vungChon, cacBaoCao, onGuiBaoCao } = props;
  const [activeTab, setActiveTab] = useState<Tab>('thongtin');

  const TabButton: React.FC<{tabName: Tab, label: string, icon?: React.ReactNode}> = ({ tabName, label, icon }) => (
     <button
        onClick={() => setActiveTab(tabName)}
        className={`flex-1 py-3 px-2 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${
          activeTab === tabName
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-blue-500 border-b-2 border-transparent'
        }`}
      >
        {icon}
        {label}
      </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200">
        <TabButton tabName="thongtin" label="Thông Tin" />
        <TabButton tabName="baocao" label="Báo Cáo" />
        <TabButton tabName="gopy" label="Đóng Góp" />
        <TabButton tabName="timduong" label="Tìm Đường" icon={<RouteIcon className="w-5 h-5"/>} />
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {activeTab === 'thongtin' && (
          vungChon ? (
            <ChiTietThuyTrieu vung={vungChon} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Chọn một vùng trên bản đồ để xem chi tiết.
            </div>
          )
        )}

        {activeTab === 'baocao' && (
          <DanhSachBaoCao cacBaoCao={cacBaoCao} />
        )}

        {activeTab === 'gopy' && (
          <FormBaoCao onGuiBaoCao={onGuiBaoCao} />
        )}
        
        {activeTab === 'timduong' && (
          <TimDuong 
            onTimDuong={props.onTimDuong}
            onXoaDuong={props.onXoaDuong}
            dangTimDuong={props.dangTimDuong}
            ketQuaDuong={props.ketQuaDuong}
            tinhTrangDuong={props.tinhTrangDuong}
            loiTimDuong={props.loiTimDuong}
            origin={props.originAddress}
            onOriginChange={props.onOriginChange}
            destination={props.destinationAddress}
            onDestinationChange={props.onDestinationChange}
            onSetPickingFor={props.onSetPickingFor}
          />
        )}
      </div>
    </div>
  );
};
