import { useState, useCallback } from 'react';
import type { ToaDo } from '../types';

export const useViTri = () => {
  const [viTri, setViTri] = useState<ToaDo | null>(null);
  const [dangLayViTri, setDangLayViTri] = useState<boolean>(false);
  const [loiViTri, setLoiViTri] = useState<string | null>(null);

  const layViTriHienTai = useCallback((onSuccess?: (coords: ToaDo) => void) => {
    if (!navigator.geolocation) {
      setLoiViTri('Trình duyệt của bạn không hỗ trợ định vị.');
      return;
    }

    setDangLayViTri(true);
    setLoiViTri(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setViTri(newPosition);
        setDangLayViTri(false);
        if (onSuccess) {
          onSuccess(newPosition);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLoiViTri('Bạn đã từ chối quyền truy cập vị trí.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLoiViTri('Thông tin vị trí không khả dụng.');
            break;
          case error.TIMEOUT:
            setLoiViTri('Yêu cầu lấy vị trí đã hết hạn.');
            break;
          default:
            setLoiViTri('Đã xảy ra lỗi khi lấy vị trí.');
            break;
        }
        setDangLayViTri(false);
      }
    );
  }, []);

  return { viTri, dangLayViTri, loiViTri, layViTriHienTai };
};
