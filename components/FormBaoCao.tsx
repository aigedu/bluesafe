
import React, { useState, useRef, useCallback } from 'react';
import type { BaoCaoNguoiDung } from '../types';
import { useViTri } from '../hooks/useViTri';
import { CameraIcon } from './Icons';

interface FormBaoCaoProps {
  onGuiBaoCao: (baoCao: Omit<BaoCaoNguoiDung, 'id' | 'thoiGianGui' | 'trangThai'>) => Promise<void>;
}

export const FormBaoCao: React.FC<FormBaoCaoProps> = ({ onGuiBaoCao }) => {
  const [moTa, setMoTa] = useState('');
  const [mucNuoc, setMucNuoc] = useState('');
  const [dangGui, setDangGui] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { viTri, dangLayViTri, layViTriHienTai, loiViTri } = useViTri();

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleOpenCamera = async () => {
    // Stop any existing stream before starting a new one
    stopCameraStream();
    setCapturedImage(null);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Lỗi mở camera:", err);
        alert("Không thể truy cập camera. Vui lòng cấp quyền và thử lại.");
        setIsCameraOpen(false);
      }
    } else {
      alert("Trình duyệt của bạn không hỗ trợ truy cập camera.");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        layViTriHienTai(); // Capture location at the same time
      }
    }
    stopCameraStream();
    setIsCameraOpen(false);
  };

  const xuLySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moTa.trim()) {
      alert('Vui lòng nhập mô tả tình hình.');
      return;
    }
    if (!capturedImage) {
      alert('Vui lòng chụp ảnh thực tế để xác thực.');
      return;
    }
    if (!viTri) {
      alert('Không thể xác định vị trí của bạn. Vui lòng bật GPS và cho phép truy cập.');
      return;
    }

    setDangGui(true);
    
    // In a real app, this base64 data would be uploaded to a storage service.
    // The mock API simulates this by assigning a random picsum URL.
    const baoCaoMoi = {
      toaDo: viTri,
      moTa,
      mucNuocThucTe: mucNuoc ? parseFloat(mucNuoc) : undefined,
      hinhAnhUrl: capturedImage, // Pass the base64 string
      thoiGianGhiNhan: new Date().toISOString(),
      nguoiGui: 'Người dùng đã xác thực',
    };

    await onGuiBaoCao(baoCaoMoi);

    // Reset form
    setMoTa('');
    setMucNuoc('');
    setCapturedImage(null);
    setDangGui(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Đóng góp thông tin thực tế</h2>
      <p className="text-sm text-gray-600">Sử dụng camera để chụp ảnh và ghi lại vị trí, giúp tăng độ tin cậy cho báo cáo của bạn.</p>
      
      <form onSubmit={xuLySubmit} className="space-y-4">
        <div>
          <label htmlFor="moTa" className="block text-sm font-medium text-gray-700">Mô tả tình hình *</label>
          <textarea
            id="moTa"
            rows={3}
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ví dụ: Đường ABC ngập sâu 50cm, xe máy không đi được..."
            required
          />
        </div>

        <div>
            <label htmlFor="mucNuoc" className="block text-sm font-medium text-gray-700">Mực nước ước tính (mét)</label>
            <input
                type="number"
                id="mucNuoc"
                step="0.1"
                value={mucNuoc}
                onChange={(e) => setMucNuoc(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Ví dụ: 0.5"
            />
        </div>

        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
          <canvas ref={canvasRef} className="hidden"></canvas>
          {isCameraOpen && (
              <div className="space-y-2">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-md bg-black"></video>
                  <div className="flex gap-2">
                      <button type="button" onClick={handleCapture} className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Chụp ảnh</button>
                      <button type="button" onClick={() => { stopCameraStream(); setIsCameraOpen(false); }} className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Hủy</button>
                  </div>
              </div>
          )}

          {capturedImage && !isCameraOpen && (
              <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-800">Ảnh đã chụp:</p>
                  <img src={capturedImage} alt="Ảnh đã chụp để báo cáo" className="w-full rounded-md" />
                  {dangLayViTri && <p className="text-sm text-blue-600">Đang lấy vị trí...</p>}
                  {loiViTri && <p className="text-sm text-red-500 mt-1">{loiViTri}</p>}
                  {viTri && <p className="text-sm text-green-600 mt-1">✓ Vị trí đã được ghi nhận.</p>}
                  <button type="button" onClick={handleOpenCamera} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Chụp lại
                  </button>
              </div>
          )}

          {!isCameraOpen && !capturedImage && (
              <button type="button" onClick={handleOpenCamera} className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <CameraIcon className="h-5 w-5 mr-2" />
                  Mở Camera & Lấy Vị Trí
              </button>
          )}
        </div>

        <button type="submit" disabled={dangGui || !viTri || !capturedImage || dangLayViTri} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
          {dangGui ? 'Đang gửi...' : 'Gửi Báo Cáo'}
        </button>
      </form>
    </div>
  );
};