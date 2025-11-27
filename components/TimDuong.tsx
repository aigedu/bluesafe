// FIX: Declare google as any to workaround missing @types/google.maps
// FIX: Declare google as any to workaround missing @types/google.maps
declare const google: any;
import React, { useRef, useEffect } from 'react';
import type { TinhTrangTuyenDuong } from '../types';
import { useViTri } from '../hooks/useViTri';
import { WarningIcon, MyLocationIcon, RouteIcon, MapPinSelectIcon } from './Icons';

interface TimDuongProps {
  onTimDuong: () => void;
  onXoaDuong: () => void;
  dangTimDuong: boolean;
  // FIX: Cannot find namespace 'google'.
  ketQuaDuong: any | null;
  tinhTrangDuong: TinhTrangTuyenDuong;
  loiTimDuong: string | null;
  origin: string;
  onOriginChange: (value: string) => void;
  destination: string;
  onDestinationChange: (value: string) => void;
  onSetPickingFor: (type: 'origin' | 'destination' | null) => void;
}

export const TimDuong: React.FC<TimDuongProps> = (props) => {
  const { 
    onTimDuong, onXoaDuong, dangTimDuong, ketQuaDuong, tinhTrangDuong, loiTimDuong,
    origin, onOriginChange, destination, onDestinationChange, onSetPickingFor 
  } = props;
  
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const { layViTriHienTai } = useViTri();

  useEffect(() => {
    // FIX: Property 'google' does not exist on type 'Window & typeof globalThis'.
    if (typeof google === 'undefined' || !originRef.current || !destinationRef.current) return;

    const options = {
      componentRestrictions: { country: 'vn' },
      fields: ['formatted_address'],
    };

    const autocompleteOrigin = new google.maps.places.Autocomplete(originRef.current, options);
    autocompleteOrigin.addListener('place_changed', () => {
        onOriginChange(autocompleteOrigin.getPlace().formatted_address || '');
    });

    const autocompleteDest = new google.maps.places.Autocomplete(destinationRef.current, options);
    autocompleteDest.addListener('place_changed', () => {
        onDestinationChange(autocompleteDest.getPlace().formatted_address || '');
    });

  }, [onOriginChange, onDestinationChange]);

  const handleUseMyLocation = () => {
      layViTriHienTai((coords) => {
          const latLng = new google.maps.LatLng(coords.lat, coords.lng);
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: latLng }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                  onOriginChange(results[0].formatted_address);
              } else {
                  onOriginChange(`${coords.lat}, ${coords.lng}`);
              }
          })
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
        onTimDuong();
    }
  };
  
  const route = ketQuaDuong?.routes[0];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center"><RouteIcon className="w-6 h-6 mr-2 text-blue-600"/>Tìm đường đi an toàn</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Điểm đi</label>
            <div className="mt-1 flex items-center gap-2">
                 <input
                    ref={originRef}
                    id="origin"
                    type="text"
                    value={origin}
                    onChange={(e) => onOriginChange(e.target.value)}
                    className="block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập điểm đi hoặc chọn trên bản đồ"
                />
                <button type="button" onClick={() => onSetPickingFor('origin')} aria-label="Chọn điểm đi trên bản đồ" className="p-2 rounded-md hover:bg-gray-200 transition-colors">
                    <MapPinSelectIcon className="h-6 w-6 text-gray-500 hover:text-blue-600" />
                </button>
                 <button type="button" onClick={handleUseMyLocation} aria-label="Sử dụng vị trí của tôi" className="p-2 rounded-md hover:bg-gray-200 transition-colors">
                    <MyLocationIcon className="h-6 w-6 text-gray-500 hover:text-blue-600" />
                </button>
            </div>
        </div>
        <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Điểm đến</label>
             <div className="mt-1 flex items-center gap-2">
                <input
                    ref={destinationRef}
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => onDestinationChange(e.target.value)}
                    className="block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập điểm đến hoặc chọn trên bản đồ"
                />
                <button type="button" onClick={() => onSetPickingFor('destination')} aria-label="Chọn điểm đến trên bản đồ" className="p-2 rounded-md hover:bg-gray-200 transition-colors">
                    <MapPinSelectIcon className="h-6 w-6 text-gray-500 hover:text-blue-600" />
                </button>
            </div>
        </div>
        <div className="flex gap-2 pt-2">
            <button type="submit" disabled={dangTimDuong || !origin || !destination} className="w-full flex-grow justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                {dangTimDuong ? 'Đang tìm...' : 'Tìm đường'}
            </button>
            {ketQuaDuong && (
                <button type="button" onClick={onXoaDuong} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Xóa
                </button>
            )}
        </div>
      </form>
      
      {loiTimDuong && <p className="text-sm text-red-600 pt-2">{loiTimDuong}</p>}
      
      {route && (
        <div className="space-y-4 pt-4 border-t animate-fade-in-down">
          {tinhTrangDuong === 'NGUY_HIEM' && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md flex items-start">
                  <WarningIcon className="w-10 h-10 text-orange-500 mr-3 flex-shrink-0"/>
                  <div>
                    <h3 className="font-bold text-orange-800">Cảnh báo tuyến đường</h3>
                    <p className="text-sm text-orange-700">Tuyến đường được đề xuất có thể đi qua vùng đang có cảnh báo ngập. Vui lòng cân nhắc lộ trình khác hoặc di chuyển cẩn thận.</p>
                  </div>
              </div>
          )}
           {tinhTrangDuong === 'AN_TOAN' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-bold text-green-800">Tuyến đường an toàn</h3>
                  <p className="text-sm text-green-700">Không phát hiện vùng nguy hiểm trên tuyến đường này.</p>
              </div>
          )}

          <div className="text-sm bg-white p-3 rounded-md border">
            <p><strong>Quãng đường:</strong> {route.legs[0].distance?.text}</p>
            <p><strong>Thời gian dự kiến:</strong> {route.legs[0].duration?.text}</p>
          </div>

          <div>
              <h3 className="font-semibold mb-2">Chỉ dẫn:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm max-h-60 overflow-y-auto pr-2 bg-white p-3 rounded-md border">
                  {route.legs[0].steps.map((step, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: step.instructions }} className="text-gray-700 pl-2"/>
                  ))}
              </ol>
          </div>
        </div>
      )}
    </div>
  );
};
