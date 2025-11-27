// FIX: Declare google as any to workaround missing @types/google.maps
declare const google: any;
import React, { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { DuLieuThuyTrieu, BaoCaoNguoiDung, VungCanhBao, ToaDo, BaoCaoKhanCap, TinhTrangTuyenDuong } from '../types';
import { MucDoCanhBao } from '../types';

interface BanDoGiaProps {
  duLieuThuyTrieu: DuLieuThuyTrieu;
  cacBaoCao: BaoCaoNguoiDung[];
  cacBaoCaoKhanCap: BaoCaoKhanCap[];
  vungChon: VungCanhBao | null;
  onChonVung: (vung: VungCanhBao) => void;
  filters: {
    showWarnings: boolean;
    showReports: boolean;
  };
  viTriNguoiDung: ToaDo | null;
  viTriHienTai: ToaDo | null;
  onPanComplete: () => void;
  // FIX: Cannot find namespace 'google'.
  ketQuaDuong: any | null;
  tinhTrangDuong: TinhTrangTuyenDuong;
  pickingFor: 'origin' | 'destination' | 'emergency' | null;
  // FIX: Cannot find namespace 'google'.
  onMapClick: (event: any) => void;
}

const layMauCanhBaoGoogle = (muc: MucDoCanhBao): string => {
  switch (muc) {
    case MucDoCanhBao.AN_TOAN: return '#22c55e';
    case MucDoCanhBao.THAP: return '#facc15';
    case MucDoCanhBao.TRUNG_BINH: return '#f97316';
    case MucDoCanhBao.CAO: return '#ef4444';
    case MucDoCanhBao.NGUY_HIEM: return '#a855f7';
    default: return '#6b7280';
  }
};

const BaoCaoOverlayComponent: React.FC<{ baoCao: BaoCaoNguoiDung }> = ({ baoCao }) => (
    <div className="relative transform -translate-x-1/2 -translate-y-full" style={{ zIndex: 150 }}>
        <div className="p-1 bg-white rounded-lg shadow-lg border-2 border-blue-500 hover:scale-110 transition-transform duration-200">
            <img 
                src={baoCao.hinhAnhUrl} 
                alt={baoCao.moTa} 
                className="w-20 h-20 object-cover rounded" 
            />
        </div>
        <div className="absolute left-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-500 transform -translate-x-1/2"></div>
    </div>
);

// FIX: Cannot find namespace 'google'.
class CustomReportOverlay extends google.maps.OverlayView {
    // FIX: Cannot find namespace 'google'.
    private position: any;
    private baoCao: BaoCaoNguoiDung;
    private div: HTMLDivElement | null = null;
    private root: Root | null = null;

    // FIX: Cannot find namespace 'google'.
    constructor(position: any, baoCao: BaoCaoNguoiDung) {
        super();
        this.position = position;
        this.baoCao = baoCao;
    }

    onAdd() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(this.div);
        
        this.root = createRoot(this.div);
        this.root.render(<BaoCaoOverlayComponent baoCao={this.baoCao} />);
    }

    draw() {
        const overlayProjection = this.getProjection();
        if (!overlayProjection || !this.div) return;

        const point = overlayProjection.fromLatLngToDivPixel(this.position);
        if (point) {
            this.div.style.left = `${point.x}px`;
            this.div.style.top = `${point.y}px`;
        }
    }

    onRemove() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }
}

export const BanDoGia: React.FC<BanDoGiaProps> = ({ duLieuThuyTrieu, cacBaoCao, cacBaoCaoKhanCap, vungChon, onChonVung, filters, viTriNguoiDung, viTriHienTai, onPanComplete, ketQuaDuong, tinhTrangDuong, pickingFor, onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // FIX: Cannot find namespace 'google'.
  const mapInstance = useRef<any | null>(null);
  const infoWindow = useRef<any | null>(null);
  // FIX: Cannot find namespace 'google'.
  const zoneCircles = useRef<Map<string, any>>(new Map());
  const reportOverlays = useRef<Map<string, CustomReportOverlay>>(new Map());
  // FIX: Cannot find namespace 'google'.
  const emergencyMarkers = useRef<Map<string, any>>(new Map());
  // FIX: Cannot find namespace 'google'.
  const userMarker = useRef<any | null>(null);
  // FIX: Cannot find namespace 'google'.
  const directionsRenderer = useRef<any | null>(null);
  // FIX: Cannot find namespace 'google'.
  const originMarker = useRef<any | null>(null);
  // FIX: Cannot find namespace 'google'.
  const destinationMarker = useRef<any | null>(null);


  useEffect(() => {
    // FIX: Property 'google' does not exist on type 'Window & typeof globalThis'.
    if (typeof google === 'undefined') { return; }
    if (mapRef.current && !mapInstance.current) {
      const hoChiMinhCity = { lat: 10.7769, lng: 106.7009 };
      const map = new google.maps.Map(mapRef.current, {
        zoom: 11,
        center: hoChiMinhCity,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9c9c9' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a7d9f7' }] },
        ]
      });
      mapInstance.current = map;
      // FIX: Cannot find namespace 'google'.
      map.addListener('click', (e: any) => {
        onMapClick(e);
      });
    }
  }, [onMapClick]);

  useEffect(() => {
      if (!mapInstance.current) return;
      mapInstance.current.setOptions({ draggableCursor: pickingFor ? 'crosshair' : '' });
  }, [pickingFor]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    duLieuThuyTrieu.vungCanhBao.forEach(vung => {
        const isSelected = vung.id === vungChon?.id;
        const color = layMauCanhBaoGoogle(vung.mucCanhBao);

        let circle = zoneCircles.current.get(vung.id);
        if (!circle) {
             circle = new google.maps.Circle({
                strokeColor: '#1e3a8a',
                strokeOpacity: 0.8,
                fillOpacity: 0.5,
                map: map,
                center: vung.tam,
                radius: vung.banKinh,
            });
            circle.addListener('click', () => onChonVung(vung));
            zoneCircles.current.set(vung.id, circle);
        }

        circle.setOptions({
            strokeWeight: isSelected ? 4 : 1.5,
            fillColor: color,
            zIndex: isSelected ? 10 : 1,
        });

        circle.setMap(filters.showWarnings ? map : null);
    });

  }, [duLieuThuyTrieu, vungChon, onChonVung, filters.showWarnings]);
  
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const currentReportIds = new Set(cacBaoCao.filter(bc => bc.hinhAnhUrl).map(bc => bc.id));

    // Remove old overlays
    reportOverlays.current.forEach((overlay, id) => {
        if (!currentReportIds.has(id)) {
            overlay.setMap(null);
            reportOverlays.current.delete(id);
        }
    });

    // Add new overlays
    cacBaoCao.forEach(baoCao => {
      if (baoCao.hinhAnhUrl && !reportOverlays.current.has(baoCao.id)) {
        const position = new google.maps.LatLng(baoCao.toaDo.lat, baoCao.toaDo.lng);
        const overlay = new CustomReportOverlay(position, baoCao);
        reportOverlays.current.set(baoCao.id, overlay);
      }
    });
    
    // Toggle visibility based on filter
     reportOverlays.current.forEach(overlay => {
        overlay.setMap(filters.showReports ? map : null);
    });

  }, [cacBaoCao, filters.showReports]);

  // Effect for emergency reports
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Close any open info window when the reports are updated
    infoWindow.current?.close();
    
    const currentEmergencyIds = new Set(cacBaoCaoKhanCap.map(bc => bc.id));

    emergencyMarkers.current.forEach((marker, id) => {
        if (!currentEmergencyIds.has(id)) {
            marker.setMap(null);
            emergencyMarkers.current.delete(id);
        }
    });

    cacBaoCaoKhanCap.forEach(baoCao => {
        if (!emergencyMarkers.current.has(baoCao.id)) {
            const marker = new google.maps.Marker({
                position: baoCao.toaDo,
                map: map,
                title: `KHẨN CẤP: ${baoCao.moTa}`,
                icon: {
                    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
                    fillColor: '#dc2626', // red-600
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                    anchor: new google.maps.Point(12, 12),
                },
                animation: google.maps.Animation.BOUNCE,
                zIndex: 9999,
            });

            marker.addListener('click', () => {
                if (!infoWindow.current) {
                    infoWindow.current = new google.maps.InfoWindow();
                }
                const formattedTime = new Date(baoCao.thoiGianGui).toLocaleString('vi-VN', {
                    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                });
                const contentString = `
                    <div style="font-family: 'Be Vietnam Pro', sans-serif; max-width: 250px; padding: 8px;">
                        <h3 style="font-weight: bold; font-size: 16px; color: #dc2626; margin: 0 0 8px;">Báo Cáo Khẩn Cấp</h3>
                        <p style="font-size: 14px; margin: 0 0 4px;">${baoCao.moTa}</p>
                        <p style="font-size: 12px; color: #666; margin: 0;">Thời gian: ${formattedTime}</p>
                    </div>`;

                infoWindow.current.setContent(contentString);
                infoWindow.current.open(map, marker);
            });

            emergencyMarkers.current.set(baoCao.id, marker);
        }
    });
  }, [cacBaoCaoKhanCap]);

  useEffect(() => {
    if (!mapInstance.current) return;

    if (viTriHienTai) {
      if (!userMarker.current) {
        userMarker.current = new google.maps.Marker({
          position: viTriHienTai,
          map: mapInstance.current,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#1d4ed8', // blue-700
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 1.8,
            anchor: new google.maps.Point(12, 24),
          },
          title: 'Vị trí của bạn',
          zIndex: 1000,
        });
      } else {
        userMarker.current.setPosition(viTriHienTai);
        if (!userMarker.current.getMap()) {
          userMarker.current.setMap(mapInstance.current);
        }
      }
    }
  }, [viTriHienTai]);

  useEffect(() => {
    if (mapInstance.current && vungChon && !ketQuaDuong) {
      const circle = zoneCircles.current.get(vungChon.id);
      if(circle) {
          const bounds = circle.getBounds();
          if (bounds) {
              mapInstance.current.fitBounds(bounds, 50);
          }
      }
    }
  }, [vungChon, ketQuaDuong]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !viTriNguoiDung) {
      return;
    }

    map.panTo(viTriNguoiDung);

    const idleListener = google.maps.event.addListenerOnce(map, 'idle', () => {
        if (map.getZoom() !== 15) {
            map.setZoom(15);
        }
        onPanComplete();
    });

    return () => {
      google.maps.event.removeListener(idleListener);
    };
  }, [viTriNguoiDung, onPanComplete]);

  // Effect for rendering directions
  useEffect(() => {
    if (!mapInstance.current) return;

    if (!directionsRenderer.current) {
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // Hide default A/B markers
      });
      directionsRenderer.current.setMap(mapInstance.current);
    }
    
    // Clear old markers
    originMarker.current?.setMap(null);
    destinationMarker.current?.setMap(null);

    if (ketQuaDuong) {
      const routeColor = tinhTrangDuong === 'NGUY_HIEM' ? '#f97316' : '#2563eb';
      directionsRenderer.current.setOptions({
        polylineOptions: {
          strokeColor: routeColor,
          strokeWeight: 6,
          strokeOpacity: 0.8,
        },
      });
      directionsRenderer.current.setDirections(ketQuaDuong);

      // Add custom markers for origin and destination
      const leg = ketQuaDuong.routes[0].legs[0];
      if (leg.start_location) {
        originMarker.current = new google.maps.Marker({
            position: leg.start_location,
            map: mapInstance.current,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#16a34a"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
            },
            title: 'Điểm đi'
        });
      }
      if (leg.end_location) {
        destinationMarker.current = new google.maps.Marker({
            position: leg.end_location,
            map: mapInstance.current,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
            },
            title: 'Điểm đến'
        });
      }
    } else {
      directionsRenderer.current.setDirections(null);
    }

  }, [ketQuaDuong, tinhTrangDuong]);


  return <div ref={mapRef} className="w-full h-full" />;
};