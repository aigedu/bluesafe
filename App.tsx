// FIX: Declare google as any to workaround missing @types/google.maps
declare const google: any;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { BanDoGia } from './components/BanDoGia';
import { BangDieuKhien } from './components/BangDieuKhien';
import { BoLocBanDo } from './components/BoLocBanDo';
import { ModalKhanCap } from './components/ModalKhanCap';
import { CanhBaoTuDong } from './components/CanhBaoTuDong';
import { layDuLieuThuyTrieuGia, layCacBaoCaoGia, themBaoCaoMoiGia, layCacBaoCaoKhanCapGia, themBaoCaoKhanCapMoiGia } from './services/api';
import type { DuLieuThuyTrieu, BaoCaoNguoiDung, VungCanhBao, ToaDo, BaoCaoKhanCap, TinhTrangTuyenDuong } from './types';
import { MucDoCanhBao } from './types';
import { useNotifications } from './hooks/useNotifications';

interface Filters {
  showWarnings: boolean;
  showReports: boolean;
}

const playAlertSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
        console.warn("Web Audio API is not supported in this browser.");
        return;
    }
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
};

const App: React.FC = () => {
  const [duLieuThuyTrieu, setDuLieuThuyTrieu] = useState<DuLieuThuyTrieu | null>(null);
  const [cacBaoCao, setCacBaoCao] = useState<BaoCaoNguoiDung[]>([]);
  const [cacBaoCaoKhanCap, setCacBaoCaoKhanCap] = useState<BaoCaoKhanCap[]>([]);
  const [vungChon, setVungChon] = useState<VungCanhBao | null>(null);
  const [dangTai, setDangTai] = useState<boolean>(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [viTriNguoiDung, setViTriNguoiDung] = useState<ToaDo | null>(null);
  const [viTriHienTai, setViTriHienTai] = useState<ToaDo | null>(null);
  const [isModalKhanCapOpen, setIsModalKhanCapOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    showWarnings: true,
    showReports: true,
  });
  const [vungCanhBaoHienThi, setVungCanhBaoHienThi] = useState<VungCanhBao[]>([]);
  const alertedZoneIds = useRef(new Set<string>());
  const { permission, sendNotification } = useNotifications();

  // State for route finding and location picking
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [pickingFor, setPickingFor] = useState<'origin' | 'destination' | 'emergency' | null>(null);
  const [viTriBaoCaoKhanCap, setViTriBaoCaoKhanCap] = useState<ToaDo | null>(null);

  // FIX: Cannot find namespace 'google'.
  const [ketQuaDuong, setKetQuaDuong] = useState<any | null>(null);
  const [tinhTrangDuong, setTinhTrangDuong] = useState<TinhTrangTuyenDuong>('KHONG_XAC_DINH');
  const [dangTimDuong, setDangTimDuong] = useState<boolean>(false);
  const [loiTimDuong, setLoiTimDuong] = useState<string | null>(null);

  const taiDuLieu = useCallback(async (isInitialLoad = false) => {
    try {
      if(isInitialLoad) setDangTai(true);
      const [dataThuyTrieu, dataBaoCao, dataBaoCaoKhanCap] = await Promise.all([
        layDuLieuThuyTrieuGia(),
        layCacBaoCaoGia(),
        layCacBaoCaoKhanCapGia(),
      ]);
      setDuLieuThuyTrieu(dataThuyTrieu);
      setCacBaoCao(dataBaoCao);
      setCacBaoCaoKhanCap(dataBaoCaoKhanCap);
      
      if (vungChon) {
          const vungChonCapNhat = dataThuyTrieu.vungCanhBao.find(v => v.id === vungChon.id);
          if (vungChonCapNhat) {
              setVungChon(vungChonCapNhat);
          }
      } else if (isInitialLoad && dataThuyTrieu.vungCanhBao.length > 0) {
        setVungChon(dataThuyTrieu.vungCanhBao[0]);
      }

    } catch (err) {
      setLoi('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      if(isInitialLoad) setDangTai(false);
    }
  }, [vungChon]);

  useEffect(() => {
    taiDuLieu(true);

    const intervalId = setInterval(() => {
      taiDuLieu(false);
    }, 10000); 

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (duLieuThuyTrieu) {
        const zonesWithHighAlert = duLieuThuyTrieu.vungCanhBao.filter(v => 
            v.mucCanhBao === MucDoCanhBao.CAO || v.mucCanhBao === MucDoCanhBao.NGUY_HIEM
        );

        const newAlerts = zonesWithHighAlert.filter(v => !alertedZoneIds.current.has(v.id));

        if (newAlerts.length > 0) {
            setVungCanhBaoHienThi(prev => [...prev.filter(p => !newAlerts.some(n => n.id === p.id)), ...newAlerts]);
            newAlerts.forEach(v => {
              alertedZoneIds.current.add(v.id)
              if (permission === 'granted') {
                sendNotification(
                  'CẢNH BÁO TRIỀU CƯỜNG',
                  `Khu vực ${v.ten} đang ở mức cảnh báo ${v.mucCanhBao.toLowerCase()}.`
                );
              }
            });
            playAlertSound();
        }

        const highAlertIds = new Set(zonesWithHighAlert.map(v => v.id));
        alertedZoneIds.current.forEach(id => {
            if (!highAlertIds.has(id)) {
                alertedZoneIds.current.delete(id);
            }
        });

        setVungCanhBaoHienThi(prev => prev.filter(v => highAlertIds.has(v.id)));
    }
  }, [duLieuThuyTrieu, permission, sendNotification]);

  const handleDismissAlert = (zoneId: string) => {
    setVungCanhBaoHienThi(prev => prev.filter(v => v.id !== zoneId));
  };


  const xuLyChonVung = (vung: VungCanhBao) => {
    setVungChon(vung);
  };

  const xuLyGuiBaoCao = async (baoCao: Omit<BaoCaoNguoiDung, 'id' | 'thoiGianGui' | 'trangThai'>) => {
    try {
        await themBaoCaoMoiGia(baoCao);
        const dataBaoCao = await layCacBaoCaoGia();
        setCacBaoCao(dataBaoCao);
        alert('Báo cáo của bạn đã được gửi và đang chờ kiểm duyệt. Cảm ơn bạn đã đóng góp!');
    } catch (error) {
        console.error("Lỗi gửi báo cáo:", error);
        alert('Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
    }
  };
  
  const xuLyGuiBaoCaoKhanCap = async (baoCao: Omit<BaoCaoKhanCap, 'id' | 'thoiGianGui'>) => {
     try {
        await themBaoCaoKhanCapMoiGia(baoCao);
        const dataBaoCaoKhanCap = await layCacBaoCaoKhanCapGia();
        setCacBaoCaoKhanCap(dataBaoCaoKhanCap);
        alert('Báo cáo khẩn cấp của bạn đã được gửi! Lực lượng hỗ trợ sẽ sớm liên hệ.');
        setIsModalKhanCapOpen(false);
    } catch (error) {
        console.error("Lỗi gửi báo cáo khẩn cấp:", error);
        alert('Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };
  
  const handleGoToMyLocation = (location: ToaDo) => {
    setViTriNguoiDung(location);
    setViTriHienTai(location);
  };

  const handlePanComplete = useCallback(() => {
    setViTriNguoiDung(null);
  }, []);

  const xuLyXoaDuong = () => {
    setKetQuaDuong(null);
    setTinhTrangDuong('KHONG_XAC_DINH');
    setLoiTimDuong(null);
    setOriginAddress('');
    setDestinationAddress('');
  }

  // FIX: Cannot find namespace 'google'.
  const handleMapClick = useCallback((event: any) => {
    if (!pickingFor || !event.latLng) return;

    if (pickingFor === 'emergency') {
        setViTriBaoCaoKhanCap({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        setIsModalKhanCapOpen(true);
        setPickingFor(null);
        return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            if (pickingFor === 'origin') {
                setOriginAddress(address);
            } else { // destination
                setDestinationAddress(address);
            }
        } else {
            console.error('Geocoder failed due to: ' + status);
            const target = pickingFor === 'origin' ? 'điểm đi' : 'điểm đến';
            alert(`Không thể xác định địa chỉ cho ${target}. Vui lòng thử lại.`);
        }
        setPickingFor(null);
    });
  }, [pickingFor]);


  const xuLyTimDuong = useCallback(() => {
    if (!originAddress || !destinationAddress) return;

    // FIX: Property 'google' does not exist on type 'Window & typeof globalThis'.
    if (!duLieuThuyTrieu || !google || !google.maps.geometry) {
        setLoiTimDuong("Dịch vụ bản đồ chưa sẵn sàng, vui lòng thử lại sau.");
        return;
    }
    
    // Clear previous route before searching
    setKetQuaDuong(null);
    setTinhTrangDuong('KHONG_XAC_DINH');
    setLoiTimDuong(null);

    setDangTimDuong(true);
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: originAddress,
        destination: destinationAddress,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setDangTimDuong(false);
        if (status === google.maps.DirectionsStatus.OK && result) {
          
          const vungNguyHiem = duLieuThuyTrieu.vungCanhBao.filter(v => 
            v.mucCanhBao === MucDoCanhBao.CAO || v.mucCanhBao === MucDoCanhBao.NGUY_HIEM
          );

          let isUnsafe = false;
          const routePath = result.routes[0]?.overview_path;

          if (routePath && vungNguyHiem.length > 0) {
            for (const point of routePath) {
              for (const zone of vungNguyHiem) {
                const zoneCenter = new google.maps.LatLng(zone.tam.lat, zone.tam.lng);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(point, zoneCenter);
                if (distance <= zone.banKinh) {
                  isUnsafe = true;
                  break;
                }
              }
              if (isUnsafe) break;
            }
          }

          setKetQuaDuong(result);
          setTinhTrangDuong(isUnsafe ? 'NGUY_HIEM' : 'AN_TOAN');

        } else {
          setLoiTimDuong("Không tìm thấy đường đi. Vui lòng kiểm tra lại điểm đi và điểm đến.");
        }
      }
    );
  }, [duLieuThuyTrieu, originAddress, destinationAddress]);


  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <CanhBaoTuDong vungCanhBao={vungCanhBaoHienThi} onDismiss={handleDismissAlert} />
      <Header onBaoCaoKhanCap={() => setIsModalKhanCapOpen(true)} />
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {dangTai ? (
          <div className="flex-1 flex items-center justify-center text-lg font-medium">Đang tải dữ liệu bản đồ...</div>
        ) : loi ? (
          <div className="flex-1 flex items-center justify-center text-red-500">{loi}</div>
        ) : duLieuThuyTrieu ? (
          <>
            <div className="md:w-2/3 w-full h-1/2 md:h-full relative order-1 md:order-1">
              <BanDoGia
                duLieuThuyTrieu={duLieuThuyTrieu}
                cacBaoCao={cacBaoCao.filter(bc => bc.trangThai === 'da_duyet')}
                cacBaoCaoKhanCap={cacBaoCaoKhanCap}
                vungChon={vungChon}
                onChonVung={xuLyChonVung}
                filters={filters}
                viTriNguoiDung={viTriNguoiDung}
                viTriHienTai={viTriHienTai}
                onPanComplete={handlePanComplete}
                ketQuaDuong={ketQuaDuong}
                tinhTrangDuong={tinhTrangDuong}
                pickingFor={pickingFor}
                onMapClick={handleMapClick}
              />
               <BoLocBanDo 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onGoToMyLocation={handleGoToMyLocation}
               />
            </div>
            <div className="md:w-1/3 w-full h-1/2 md:h-full overflow-y-auto bg-white shadow-lg order-2 md:order-2">
              <BangDieuKhien 
                vungChon={vungChon} 
                cacBaoCao={cacBaoCao.filter(bc => bc.trangThai === 'da_duyet')}
                onGuiBaoCao={xuLyGuiBaoCao}
                onTimDuong={xuLyTimDuong}
                onXoaDuong={xuLyXoaDuong}
                dangTimDuong={dangTimDuong}
                ketQuaDuong={ketQuaDuong}
                tinhTrangDuong={tinhTrangDuong}
                loiTimDuong={loiTimDuong}
                originAddress={originAddress}
                onOriginChange={setOriginAddress}
                destinationAddress={destinationAddress}
                onDestinationChange={setDestinationAddress}
                onSetPickingFor={setPickingFor}
              />
            </div>
          </>
        ) : null}
      </main>
      <ModalKhanCap 
        isOpen={isModalKhanCapOpen}
        onClose={() => {
            setIsModalKhanCapOpen(false);
            setViTriBaoCaoKhanCap(null);
        }}
        onGuiBaoCao={xuLyGuiBaoCaoKhanCap}
        pickedLocation={viTriBaoCaoKhanCap}
        onPickLocation={() => {
            setIsModalKhanCapOpen(false);
            setPickingFor('emergency');
        }}
        onClearPickedLocation={() => setViTriBaoCaoKhanCap(null)}
      />
    </div>
  );
};

export default App;