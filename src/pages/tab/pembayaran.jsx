import { useState, useEffect } from 'react'; // Menambahkan useEffect untuk memantau perubahan
import { Info, Plus, CreditCard, ChevronRight, Wallet, ShieldCheck, Trash2, ArrowDownToLine, X, Cpu, Link2 } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';

export default function PembayaranTab() {
const { user } = useAuthStore();
const [activePayment, setActivePayment] = useState('ewallet');
const [kredivoActive, setKredivoActive] = useState(true);
const [debitTab, setDebitTab] = useState('tambah');

const userPhone = user?.phone || '081234567890';

// ================= LOGIKA PENYIMPANAN DATA (ANTI-RESET) =================

// Fungsi untuk mengambil data awal dari Local Storage jika tersedia
const getSavedData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
};

// State Wallets: Memuat data dari memori browser saat pertama kali load
const [wallets, setWallets] = useState(() => getSavedData('marketku_wallets', [
    { id: 'gopay', name: 'GoPay', balance: 0, connected: true, provider: 'gopay' },
    { id: 'dana', name: 'DANA', balance: 0, connected: true, provider: 'dana' },
    { id: 'ovo', name: 'OVO', balance: 0, connected: false, provider: 'ovo' },
    { id: 'shopeepay', name: 'ShopeePay', balance: 0, connected: false, provider: 'shopeepay' } 
]));

// State Cards: Memuat data dari memori browser saat pertama kali load
const [cards, setCards] = useState(() => getSavedData('marketku_cards', [
    { id: 1, type: 'VISA', bank: 'BANK BCA', card_number: '•••• •••• •••• 4567', expiry_date: '12/28', balance: 0, color: 'from-[#193278] to-[#0A1742]' },
    { id: 2, type: 'Mastercard', bank: 'BANK MANDIRI', card_number: '•••• •••• •••• 8899', expiry_date: '09/27', balance: 0, color: 'from-[#1E232E] to-[#0E1116]' },
    { id: 3, type: 'JCB', bank: 'BANK BNI', card_number: '•••• •••• •••• 1122', expiry_date: '11/29', balance: 0, color: 'from-[#0F5A37] to-[#05321B]' },
    { id: 4, type: 'AMEX', bank: 'BANK BRI', card_number: '•••• •••• •••• 3344', expiry_date: '05/26', balance: 0, color: 'from-[#372E9D] to-[#1C165B]' }
]));

// Menyimpan data secara otomatis setiap kali ada perubahan pada wallets
useEffect(() => {
    localStorage.setItem('marketku_wallets', JSON.stringify(wallets));
}, [wallets]);

// Menyimpan data secara otomatis setiap kali ada perubahan pada cards[cite: 13, 15]
useEffect(() => {
    localStorage.setItem('marketku_cards', JSON.stringify(cards));
}, [cards]);

// ================= STATE MODAL TOP UP =================
const [topUpModal, setTopUpModal] = useState({ open: false, type: '', id: null, name: '' });
const [topUpAmount, setTopUpAmount] = useState('');

// ================= FUNGSI LOGIKA =================
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const toggleWallet = (id) => {
    setWallets(wallets.map(w => w.id === id ? { ...w, connected: !w.connected } : w));
};

const removeCard = (id) => {
    if(confirm('Hapus kartu ini dari daftar simpanan?')) {
    setCards(cards.filter(c => c.id !== id));
    }
};

const handleOpenTopUp = (type, item) => {
    setTopUpModal({ open: true, type, id: item.id, name: item.name || `${item.bank} (${item.type})` });
    setTopUpAmount('');
};

const handleProcessTopUp = () => {
    const amount = parseInt(topUpAmount.replace(/[^0-9]/g, ''), 10);
    if (!amount || amount <= 0) return alert('Masukkan nominal yang valid!');

    // Update state yang kemudian akan disimpan otomatis oleh useEffect[cite: 13, 15]
    if (topUpModal.type === 'wallet') {
    setWallets(wallets.map(w => w.id === topUpModal.id ? { ...w, balance: w.balance + amount } : w));
    } else if (topUpModal.type === 'card') {
    setCards(cards.map(c => c.id === topUpModal.id ? { ...c, balance: c.balance + amount } : c));
    }

    setTopUpModal({ open: false, type: '', id: null, name: '' });
    alert(`Berhasil Top Up Rp ${amount.toLocaleString('id-ID')} ke ${topUpModal.name}!`);
};

const walletVisuals = {
    gopay: { 
    color: 'from-[#1b8df7] to-[#0a5ea8]', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' 
    },
    dana: { 
    color: 'from-[#176de9] to-[#0d3f8a]', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' 
    },
    ovo: { 
    color: 'from-[#9a34d1] to-[#5d1785]', 
    logo: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='22' font-weight='900' font-style='italic' fill='%234C3494'%3EOVO%3C/text%3E%3C/svg%3E" 
    },
    shopeepay: { 
    color: 'from-[#ee4d2d] to-[#c93618]', 
    logo: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' font-weight='900' fill='%23EE4D2D'%3EShopeePay%3C/text%3E%3C/svg%3E" 
    }
};

const paymentMenus = [
    { id: 'ewallet', label: 'Dompet Digital', badge: `${wallets.filter(w => w.connected).length} Terhubung` },
    { id: 'cc', label: 'Kartu Kredit / Debit', badge: `${cards.length} / 4 Tersimpan` },
    { id: 'kredivo', label: 'Kredivo Express' },
    { id: 'debit', label: 'Debit Instan' }
];

const renderContent = () => {
    switch (activePayment) {
    
    case 'ewallet':
        return (
        <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="font-bold text-gray-800 text-sm">E-Wallet Tersimpan ({wallets.length})</h4>
            </div>

            {/* Layout Grid Persis Seperti Kartu Debit */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {wallets.map((wallet) => {
                const visual = walletVisuals[wallet.provider] || walletVisuals.gopay;
                
                return (
                <div key={wallet.id} className={`bg-gradient-to-br ${visual.color} rounded-2xl p-6 text-white relative overflow-hidden shadow-xl group border border-white/10 ${!wallet.connected && 'opacity-80 grayscale-[0.3]'}`}>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    
                    <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        {/* Nama di Atas Logo */}
                        <span className="font-black italic text-lg opacity-90">{wallet.name}</span>
                        {/* Indikator di Pojok Kanan */}
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${wallet.connected ? 'bg-green-500/30 text-green-100' : 'bg-white/20 text-white/80'}`}>
                        {wallet.connected ? 'Connected' : 'Not Connected'}
                        </span>
                    </div>
                    
                    {/* Logo E-Wallet Menggantikan Posisi Chip */}
                    <div className="mb-4 h-8 flex items-center">
                        <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm inline-block">
                        <img src={visual.logo} alt={wallet.name} className="h-4 object-contain" />
                        </div>
                    </div>
                    
                    {/* Nomor HP Sensor */}
                    <p className="text-xl font-mono tracking-widest mb-4 drop-shadow-md">
                        {wallet.connected ? `${userPhone.substring(0, 4)} **** ${userPhone.substring(userPhone.length - 4)}` : '•••• •••• ••••'}
                    </p>
                    
                    <div className="flex justify-between items-end">
                        <div>
                        <p className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Total Saldo</p>
                        <p className="text-sm font-bold text-white drop-shadow-sm">{wallet.connected ? formatRupiah(wallet.balance) : 'Rp -'}</p>
                        </div>
                    </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20">
                    {wallet.connected ? (
                        <>
                        <button onClick={() => handleOpenTopUp('wallet', wallet)} className="bg-green-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center gap-2 shadow-lg">
                            <ArrowDownToLine size={16} /> Top Up
                        </button>
                        <button onClick={() => toggleWallet(wallet.id)} className="bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-red-600 transition-transform transform hover:scale-105 shadow-lg">
                            Putuskan
                        </button>
                        </>
                    ) : (
                        <button onClick={() => toggleWallet(wallet.id)} className="bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-transform transform hover:scale-105 flex items-center gap-2 shadow-lg">
                        <Link2 size={16} /> Sambungkan
                        </button>
                    )}
                    </div>
                </div>
            )})}
            </div>
        </div>
        );

    // ================= 2. KARTU KREDIT / DEBIT =================
    case 'cc':
        return (
        <div className="animate-in fade-in duration-300">
            
            {/* KARTU SULTAN (MARKETKU CARD) - GOD MODE */}
            <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden border border-gray-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-green-400" size={28} />
                    <h4 className="text-white font-black text-xl tracking-tight">Market<span className="text-green-400">Card</span></h4>
                    <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Admin Mode</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-4">Sumber Dana Utama • Unlimited Top-Up Access</p>
                    
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Total Limit</p>
                    <p className="text-4xl text-white font-black tracking-tight flex items-center gap-2">
                    ∞ <span className="text-2xl text-green-400 font-bold">Unlimited</span>
                    </p>
                </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="font-bold text-gray-800 text-sm">Kartu Tersimpan ({cards.length})</h4>
            {cards.length < 4 && (
                <button className="text-xs font-bold text-green-500 flex items-center gap-1 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={14} /> Tambah Kartu
                </button>
            )}
            </div>

            {/* Grid UI Kartu Fisik Realistis */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {cards.map(card => (
                <div key={card.id} className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white relative overflow-hidden shadow-xl group border border-white/10`}>
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                    <span className="font-black italic text-lg opacity-90">{card.type}</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md">{card.bank}</span>
                    </div>
                    
                    <div className="mb-4 text-yellow-400/80">
                    <Cpu size={32} strokeWidth={1.5} />
                    </div>
                    
                    <p className="text-xl font-mono tracking-widest mb-4 drop-shadow-md">{card.card_number}</p>
                    
                    <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Saldo Aktif</p>
                        <p className="text-sm font-bold text-green-400 drop-shadow-sm">{formatRupiah(card.balance)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Valid Thru</p>
                        <p className="text-sm font-bold font-mono">{card.expiry_date}</p>
                    </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20">
                    <button onClick={() => handleOpenTopUp('card', card)} className="bg-green-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center gap-2 shadow-lg">
                    <ArrowDownToLine size={16} /> Top Up
                    </button>
                    <button onClick={() => removeCard(card.id)} className="bg-red-500 text-white font-bold text-xs px-3 py-2.5 rounded-xl hover:bg-red-600 transition-transform transform hover:scale-105 shadow-lg">
                    <Trash2 size={16} />
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        );

    case 'kredivo': return <div className="text-center py-10 text-gray-400 text-sm">Fitur Kredivo dilewati sementara.</div>;
    case 'debit': return <div className="text-center py-10 text-gray-400 text-sm">Fitur Debit Instan dilewati sementara.</div>;
    default: return null;
    }
};

return (
    <div className="flex flex-col md:flex-row gap-10 animate-in fade-in duration-500 min-h-[500px]">
    
    <div className="w-full md:w-[300px] shrink-0">
        <div className="mb-8">
            <h2 className="text-xl text-gray-800 leading-snug">Hai {user?.name || 'User'},<br/>selamat datang di halaman<br/><span className="font-bold text-2xl">Pengaturan Pembayaran</span></h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed pr-4">Atur pembayaran Anda untuk meningkatkan keamanan dan kemudahan berbelanja Anda di MarketKu.</p>
        </div>

        <nav className="flex flex-col border-t border-gray-100">
            {paymentMenus.map((menu) => (
                <button key={menu.id} onClick={() => setActivePayment(menu.id)} className={`flex items-center justify-between py-4 border-b border-gray-100 text-left transition-colors ${activePayment === menu.id ? 'text-green-500' : 'text-gray-800 hover:text-gray-50 hover:px-2 rounded'}`}>
                    <span className={`text-sm ${activePayment === menu.id ? 'font-bold' : 'font-medium'}`}>{menu.label}</span>
                    {menu.badge && <span className={`text-xs px-2 py-0.5 rounded-full ${activePayment === menu.id ? 'bg-green-100 text-green-600 font-bold' : 'bg-gray-100 text-gray-500 font-medium'}`}>{menu.badge}</span>}
                </button>
            ))}
        </nav>
    </div>

    <div className="flex-1">
        <div className="border border-gray-100 rounded-2xl p-6 h-full shadow-sm bg-white">
            {renderContent()}
        </div>
    </div>

    {/* ================= MODAL TOP UP ================= */}
    {topUpModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-[400px] rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setTopUpModal({open: false})} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"><X size={18} /></button>
            
            <h2 className="text-xl font-black text-gray-800 mb-1">Top Up Saldo</h2>
            <p className="text-xs text-gray-500 mb-8">Isi saldo ke <span className="font-bold text-gray-700">{topUpModal.name}</span></p>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Sumber Dana</p>
                <p className="text-sm font-black text-white relative z-10 flex items-center gap-1">Market<span className="text-green-400">Card</span></p>
                <p className="text-xs text-green-400 font-bold mt-1 relative z-10">Sisa Saldo: ∞ Unlimited</p>
            </div>

            <div className="mb-8">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nominal Top Up</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-black text-lg">Rp</span>
                    <input 
                        type="text" 
                        placeholder="0"
                        value={topUpAmount}
                        onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length > 15) val = val.slice(0, 15);
                            
                            if(val) setTopUpAmount(parseInt(val, 10).toLocaleString('id-ID'));
                            else setTopUpAmount('');
                        }}
                        className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xl font-black text-gray-800 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all" 
                    />
                </div>
            </div>

            <button onClick={handleProcessTopUp} className="w-full bg-green-500 text-white font-black py-4 rounded-2xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 text-sm uppercase tracking-widest">
                Konfirmasi Top Up
            </button>
        </div>
        </div>
    )}

    </div>
);
}