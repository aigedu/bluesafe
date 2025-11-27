
export interface ToaDo {
  lat: number;
  lng: number;
}

export enum MucDoCanhBao {
  AN_TOAN = 'An toàn',
  THAP = 'Thấp',
  TRUNG_BINH = 'Trung bình',
  CAO = 'Cao',
  NGUY_HIEM = 'Nguy hiểm'
}

export interface VungCanhBao {
  id: string;
  ten: string;
  tam: ToaDo; // Center of the circle
  banKinh: number; // Radius in meters
  mucNuocHienTai: number; // mét
  mucCanhBao: MucDoCanhBao;
  duBao: {
    thoiGian: string;
    mucNuoc: number; // mét
  }[];
}

export interface DuLieuThuyTrieu {
  vung: string;
  thoiGianCapNhat: string;
  vungCanhBao: VungCanhBao[];
}

export interface BaoCaoNguoiDung {
  id: string;
  toaDo: ToaDo;
  hinhAnhUrl?: string; // URL sau khi upload
  moTa: string;
  mucNuocThucTe?: number; // mét, không bắt buộc
  thoiGianGhiNhan: string;
  thoiGianGui: string;
  nguoiGui: string;
  trangThai: 'cho_duyet' | 'da_duyet' | 'bi_tu_choi';
}

export interface BaoCaoKhanCap {
  id: string;
  toaDo: ToaDo;
  moTa: string;
  thoiGianGui: string;
}

export type TinhTrangTuyenDuong = 'AN_TOAN' | 'NGUY_HIEM' | 'KHONG_XAC_DINH';
