import { useState } from 'react';
import { 
  CheckCircle2, LogOut, ChevronDown
} from 'lucide-react';

// 1. IMPORT STORE AUTH
import useAuthStore from '../stores/useAuthStore';

import BiodataTab from './tab/biodata';
import AlamatTab from './tab/tambahAlamat';
import PembayaranTab from './tab/pembayaran';
import RekeningTab from './tab/rekeningBank';
import NotifikasiTab from './tab/notifikasi';
import TampilanTab from './tab/personalisasi';
import KeamananTab from './tab/keamanan';

export default function Account() {
  // --- FUNGSI PERSISTENSI TAB ---
  // Kita inisialisasi state dengan mengecek localStorage terlebih dahulu
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('active_account_tab');
    return savedTab || 'biodatadiri'; // Jika kosong, default ke 'biodatadiri'
  });

  // Fungsi pembungkus untuk mengubah tab sekaligus menyimpan ke localStorage
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('active_account_tab', tabId);
  };

  // 2. AMBIL DATA USER DAN FUNGSI LOGOUT DARI STORE
  const { user, logout } = useAuthStore();
  
  const renderTab = () => {
    switch (activeTab) {
      case 'biodatadiri': return <BiodataTab />;
      case 'daftaralamat': return <AlamatTab />;
      case 'pembayaran': return <PembayaranTab />;
      case 'rekeningbank': return <RekeningTab />;
      case 'notifikasi': return <NotifikasiTab />;
      case 'modetampilan': return <TampilanTab />;
      case 'keamanan': return <KeamananTab />;
      default: return <BiodataTab />;
    }
  };

  const tabs = [
    { id: 'biodatadiri', label: 'Biodata Diri' },
    { id: 'daftaralamat', label: 'Daftar Alamat' },
    { id: 'pembayaran', label: 'Pembayaran' },
    { id: 'rekeningbank', label: 'Rekening Bank' },
    { id: 'notifikasi', label: 'Notifikasi' },
    { id: 'modetampilan', label: 'Mode Tampilan' },
    { id: 'keamanan', label: 'Keamanan' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-28 pb-20 px-4">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* ================= SIDEBAR ================= */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
          
          {/* CARD USER */}
          <div className="p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-3">
            <img src={user?.image} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
            <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user?.name || 'Bell'}</p>
                <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                    <CheckCircle2 size={10} /> Terverifikasi
                </div>
            </div>
          </div>

          {/* PLUS CARD */}
          <div className="p-4 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-green-50 to-white">
            <div className="bg-green-600 text-white text-[10px] font-black w-fit px-1.5 py-0.5 rounded mb-2 uppercase">Plus</div>
            <p className="text-[11px] font-bold text-gray-800 leading-tight">Nikmati Gratis Ongkir tanpa batas!</p>
            <p className="text-[10px] text-gray-500 mt-1">Min. belanja Rp0, bebas biaya aplikasi~</p>
          </div>

          {/* WALLET SECTION */}
          <div className="py-2 border-b border-gray-100 space-y-1">
            <SidebarWallet icon="https://p7.hiclipart.com/preview/411/493/941/logo-gopay-application-software-indonesia-money-wallet-indonesia.jpg" label="GoPay" value="Aktifkan" isLink />
            <SidebarWallet icon="https://static.republika.co.id/uploads/images/inpicture_slide/tokopedia-card_220603171309-847.jpg" label="Dana" value="Daftar" isLink />
            <SidebarWallet icon="https://cdn-icons-png.flaticon.com/512/2331/2331941.png" label="Saldo" value="Rp0" />
          </div>

          {/* NAVIGASI */}
          <nav className="space-y-4 pt-2 px-1">
            <SidebarNavSection title="Kotak Masuk" items={[
              { label: 'Chat', count: 2 }, 
              { label: 'Ulasan' }, 
              { label: 'Pesan Bantuan' },
              { label: 'Pesanan Dikomplain' },
              { label: 'Update' }
            ]} />
            
            <SidebarNavSection title="Pembelian" items={[
              { label: 'Menunggu Pembayaran' }, 
              { label: 'Daftar Transaksi' }
            ]} />
            
            <SidebarNavSection title="Profil Saya" items={[
              { label: 'Wishlist' }, 
              { label: 'Toko Favorit' },
              { label: 'Pengaturan', active: true }
            ]} />
            
            <button 
                onClick={logout}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 pl-2 pt-6 w-full text-left"
            >
              <LogOut size={14} /> Keluar Akun
            </button>
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm h-fit">
          <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)} 
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'text-green-500 border-green-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in duration-300">
            {renderTab()}
          </div>
        </main>
      </div>
    </div>
  );
}

// ================= KOMPONEN PENDUKUNG =================

function SidebarNavSection({ title, items }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-2 mb-2 cursor-pointer group">
        <span className="text-xs font-bold text-gray-800">{title}</span>
        <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
      </div>
      <div className="space-y-0.5">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between py-2 px-2 rounded-lg text-sm cursor-pointer ${item.active ? 'text-green-500 font-bold bg-green-50' : 'text-gray-500 hover:text-green-500 hover:bg-gray-50'}`}>
            <span>{item.label}</span>
            {item.count && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-black">{item.count}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarWallet({ icon, label, value, isLink }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-2 text-[12px]">
      <div className="flex items-center gap-3">
        <img src={icon} className="w-5 h-5 rounded-full object-cover" alt="" />
        <span className="text-gray-600 font-medium">{label}</span>
      </div>
      <span className={`font-bold ${isLink ? 'text-green-500 hover:underline cursor-pointer' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}