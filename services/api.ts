
import type { DuLieuThuyTrieu, BaoCaoNguoiDung, VungCanhBao, BaoCaoKhanCap } from '../types';
import { MucDoCanhBao } from '../types';

// Dữ liệu giả lập
let duLieuThuyTrieuGia: DuLieuThuyTrieu = {
  vung: "Vùng TP.HCM và lân cận",
  thoiGianCapNhat: new Date().toISOString(),
  vungCanhBao: [
    {
      id: 'nha_be',
      ten: "Khu vực Nhà Bè",
      tam: { lat: 10.675, lng: 106.735 },
      banKinh: 3500, // meters
      mucNuocHienTai: 1.5,
      mucCanhBao: MucDoCanhBao.CAO,
      duBao: [
        { thoiGian: new Date(Date.now() + 3 * 3600 * 1000).toISOString(), mucNuoc: 1.6 },
        { thoiGian: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), mucNuoc: 1.4 },
        { thoiGian: new Date(Date.now() + 9 * 3600 * 1000).toISOString(), mucNuoc: 1.1 },
      ]
    },
    {
      id: 'can_gio',
      ten: "Khu vực Cần Giờ",
      tam: { lat: 10.425, lng: 106.85 },
      banKinh: 4000, // meters
      mucNuocHienTai: 1.2,
      mucCanhBao: MucDoCanhBao.TRUNG_BINH,
      duBao: [
        { thoiGian: new Date(Date.now() + 3 * 3600 * 1000).toISOString(), mucNuoc: 1.35 },
        { thoiGian: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), mucNuoc: 1.25 },
        { thoiGian: new Date(Date.now() + 9 * 3600 * 1000).toISOString(), mucNuoc: 1.0 },
      ]
    },
    {
      id: 'quan_7',
      ten: "Khu vực Quận 7",
      tam: { lat: 10.725, lng: 106.72 },
      banKinh: 2500, // meters
      mucNuocHienTai: 0.8,
      mucCanhBao: MucDoCanhBao.THAP,
      duBao: [
        { thoiGian: new Date(Date.now() + 3 * 3600 * 1000).toISOString(), mucNuoc: 0.9 },
        { thoiGian: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), mucNuoc: 0.7 },
        { thoiGian: new Date(Date.now() + 9 * 3600 * 1000).toISOString(), mucNuoc: 0.6 },
      ]
    },
    {
      id: 'hoa_loi',
      ten: "Khu vực Hoà Lợi (Bến Cát)",
      tam: { lat: 11.085, lng: 106.635 },
      banKinh: 3000, // meters
      mucNuocHienTai: 1.1,
      mucCanhBao: MucDoCanhBao.TRUNG_BINH,
      duBao: [
        { thoiGian: new Date(Date.now() + 3 * 3600 * 1000).toISOString(), mucNuoc: 1.2 },
        { thoiGian: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), mucNuoc: 1.0 },
        { thoiGian: new Date(Date.now() + 9 * 3600 * 1000).toISOString(), mucNuoc: 0.8 },
      ]
    }
  ]
};

let cacBaoCaoGia: BaoCaoNguoiDung[] = [
  {
    id: 'bc1',
    toaDo: { lat: 10.729, lng: 106.718 },
    hinhAnhUrl: 'https://picsum.photos/400/300?image=101',
    moTa: 'Đường Huỳnh Tấn Phát ngập nặng, nước dâng cao khoảng 30cm.',
    mucNuocThucTe: 0.3,
    thoiGianGhiNhan: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    thoiGianGui: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    nguoiGui: 'Người dùng A',
    trangThai: 'da_duyet',
  },
  {
    id: 'bc2',
    toaDo: { lat: 10.675, lng: 106.735 },
    moTa: 'Khu vực gần bến phà, nước bắt đầu mấp mé bờ kè.',
    thoiGianGhiNhan: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    thoiGianGui: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    nguoiGui: 'Người dùng B',
    trangThai: 'da_duyet',
  },
   {
    id: 'bc3',
    toaDo: { lat: 10.435, lng: 106.845 },
    hinhAnhUrl: 'https://picsum.photos/400/300?image=102',
    moTa: 'Spam, thông tin không chính xác.',
    thoiGianGhiNhan: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    thoiGianGui: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    nguoiGui: 'Người dùng C',
    trangThai: 'bi_tu_choi',
  }
];

let cacBaoCaoKhanCapGia: BaoCaoKhanCap[] = [
  {
    id: 'kc1',
    toaDo: { lat: 10.678, lng: 106.740 },
    moTa: 'Bị kẹt trong nhà do nước dâng quá nhanh, cần di tản gấp. Có người già và trẻ em.',
    thoiGianGui: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
  },
  {
    id: 'kc2',
    toaDo: { lat: 10.728, lng: 106.725 },
    moTa: 'Xe bị chết máy giữa đường ngập sâu trên đường Huỳnh Tấn Phát, không thể di chuyển.',
    thoiGianGui: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
  },
  {
    id: 'kc3',
    toaDo: { lat: 10.669, lng: 106.730 },
    moTa: 'Sạt lở bờ kè nghiêm trọng, nguy cơ sập nhà. Cần hỗ trợ khẩn cấp!',
    thoiGianGui: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 giờ trước
  },
  {
    id: 'kc4',
    toaDo: { lat: 11.082, lng: 106.638 },
    moTa: 'Nước tràn vào khu công nghiệp, nhiều công nhân bị mắc kẹt, cần thuyền để di chuyển ra ngoài.',
    thoiGianGui: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
  },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const xacDinhMucCanhBao = (mucNuoc: number): MucDoCanhBao => {
    if (mucNuoc < 0.5) return MucDoCanhBao.AN_TOAN;
    if (mucNuoc < 1.0) return MucDoCanhBao.THAP;
    if (mucNuoc < 1.3) return MucDoCanhBao.TRUNG_BINH;
    if (mucNuoc < 1.6) return MucDoCanhBao.CAO;
    return MucDoCanhBao.NGUY_HIEM;
}

export const layDuLieuThuyTrieuGia = async (): Promise<DuLieuThuyTrieu> => {
  await sleep(200);
  
  const duLieuMoi = JSON.parse(JSON.stringify(duLieuThuyTrieuGia));
  duLieuMoi.thoiGianCapNhat = new Date().toISOString();
  duLieuMoi.vungCanhBao.forEach((vung: VungCanhBao) => {
    const thayDoi = (Math.random() - 0.5) * 0.2;
    vung.mucNuocHienTai = Math.max(0, parseFloat((vung.mucNuocHienTai + thayDoi).toFixed(2)));
    vung.mucCanhBao = xacDinhMucCanhBao(vung.mucNuocHienTai);
  });
  duLieuThuyTrieuGia = duLieuMoi;
  return duLieuMoi;
};

export const layCacBaoCaoGia = async (): Promise<BaoCaoNguoiDung[]> => {
  await sleep(200);
  return cacBaoCaoGia;
};

export const themBaoCaoMoiGia = async (baoCao: Omit<BaoCaoNguoiDung, 'id' | 'thoiGianGui' | 'trangThai'>): Promise<BaoCaoNguoiDung> => {
    await sleep(700);
    const baoCaoMoi: BaoCaoNguoiDung = {
        ...baoCao,
        id: `bc${Date.now()}`,
        thoiGianGui: new Date().toISOString(),
        trangThai: 'da_duyet', // Giả sử tự động duyệt để demo
    };
    cacBaoCaoGia.push(baoCaoMoi);
    return baoCaoMoi;
}

// === Báo cáo khẩn cấp ===
export const layCacBaoCaoKhanCapGia = async (): Promise<BaoCaoKhanCap[]> => {
  await sleep(150);
  const now = new Date();
  const motNgayTruoc = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Lọc các báo cáo trong vòng 24 giờ
  return cacBaoCaoKhanCapGia.filter(bc => new Date(bc.thoiGianGui) > motNgayTruoc);
}

export const themBaoCaoKhanCapMoiGia = async (baoCao: Omit<BaoCaoKhanCap, 'id' | 'thoiGianGui'>): Promise<BaoCaoKhanCap> => {
    await sleep(500);
    const baoCaoMoi: BaoCaoKhanCap = {
        ...baoCao,
        id: `kc${Date.now()}`,
        thoiGianGui: new Date().toISOString(),
    };
    cacBaoCaoKhanCapGia.push(baoCaoMoi);
    return baoCaoMoi;
}
