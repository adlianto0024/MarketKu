import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Bell, Mail, Store, Search, LogOut, 
  Wallet, CreditCard, Plus, Ticket, ChevronRight, Settings, Heart, ShoppingBag
} from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import useWishlistStore from '../stores/useWishlistStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ambil jumlah wishlist dari global store
  const wishlistCount = useWishlistStore((state) => state.wishlistItems.length);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-6">
        
        {/* 1. Logo */}
        <Link to="/" className="text-2xl font-black text-green-500 tracking-tight shrink-0">
          MarketKu
        </Link>

        {/* 2. Kategori */}
        <div className="group h-full flex items-center cursor-pointer hidden md:flex shrink-0">
          <span className="text-gray-600 hover:text-green-500 text-sm font-medium">Kategori</span>
          <div className="absolute top-[60px] left-0 w-full bg-transparent hidden group-hover:block pt-2">
            <div className="max-w-[1200px] mx-auto bg-white border border-gray-200 shadow-xl rounded-xl p-6 grid grid-cols-4 gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Elektronik</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="hover:text-green-500 cursor-pointer">Handphone</li>
                  <li className="hover:text-green-500 cursor-pointer">Laptop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 hidden md:flex">
          <div className="flex w-full items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500 transition-colors bg-white">
            <div className="pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari di MarketKu" 
              className="w-full px-3 py-2 text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* 4. Menu Kanan */}
        {user ? (
          <div className="flex items-center h-full gap-2">
            
            {/* Ikon-ikon Standar */}
            <div className="flex items-center">
               <NavIcon icon={<Heart size={22} />} count={wishlistCount} to="/wishlist" />
               <NavIcon icon={<ShoppingCart size={22} />} count={7} to="/cart" />
               <NavIcon icon={<Bell size={22} />} count={50} />
               <NavIcon icon={<Mail size={22} />} count={1} />
            </div>

            <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>

            {/* Menu Toko */}
            <div className="group h-full flex items-center px-2 gap-1 cursor-pointer relative">
              <Store size={22} className="text-gray-500 group-hover:text-green-500" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-green-500">Toko</span>
              <div className="absolute top-[50px] -right-10 w-64 bg-transparent hidden group-hover:block pt-4">
                <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-3">Anda belum memiliki toko.</p>
                  <button className="w-full bg-green-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-600">Buka Toko Gratis</button>
                </div>
              </div>
            </div>

            {/* Menu Akun */}
            <div className="group h-full flex items-center px-2 relative">
              <Link to="/account" className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 hover:border-green-500 transition-colors shrink-0">
                  {/* FOTO PROFIL KECIL (Sudah Diperbaiki) */}
                  <img 
                    src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-green-500 max-w-[80px] truncate">
                  {user.name}
                </span>
              </Link>

              {/* Dropdown Mewah */}
              <div className="absolute top-[50px] right-0 w-[420px] bg-transparent hidden group-hover:block pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
                  
                  {/* Header: User Card */}
                  <Link to="/account" className="flex items-center gap-3 p-4 m-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 rounded-full overflow-hidden shrink-0">
                      {/* FOTO PROFIL BESAR DI DROPDOWN (Sudah Diperbaiki) */}
                      <img 
                        src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                      <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Member Silver</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 shrink-0" />
                  </Link>
                  
                  <div className="grid grid-cols-2">
                    {/* Kolom Kiri: Finansial */}
                    <div className="p-4 border-r border-gray-100 space-y-5">
                      <div className="flex items-start gap-3">
                         <div className="p-1 bg-green-500 rounded-md text-white"><Plus size={14} strokeWidth={4}/></div>
                         <div>
                            <p className="text-xs font-black text-gray-800 leading-tight">PLUS <span className="text-green-500 font-bold text-[10px]">Langganan</span></p>
                            <p className="text-[10px] text-gray-500 leading-tight mt-1">Nikmati Gratis Ongkir tanpa batas!</p>
                         </div>
                      </div>

                      <AccountMiniLink icon={<Wallet size={16} className="text-blue-500"/>} label="GoPay" action="Aktifkan" />
                      <AccountMiniLink icon={<CreditCard size={16} className="text-green-600"/>} label="Market Card" action="Daftar" />
                      <AccountMiniLink icon={<Wallet size={16} className="text-green-500"/>} label="Saldo" value="Rp0" />

                      <div className="pt-2 space-y-2 border-t border-gray-50">
                        <p className="text-xs text-gray-500 flex justify-between cursor-pointer hover:text-green-500">Market Seru <span className="text-gray-400">Lihat</span></p>
                        <p className="text-xs text-gray-500 flex justify-between cursor-pointer hover:text-green-500">Misi Seru <span className="text-gray-400 font-bold">0</span></p>
                        <p className="text-xs text-gray-500 flex justify-between cursor-pointer hover:text-green-500">Kupon Saya <span className="text-gray-400">Cek</span></p>
                      </div>
                    </div>

                    {/* Kolom Kanan: Navigasi */}
                    <div className="p-4 flex flex-col justify-between">
                       <div className="space-y-4">
                          <Link to="/account?tab=pembelian" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-500 transition-colors">
                            <ShoppingBag size={18} /> Pembelian
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-500 transition-colors">
                            <Heart size={18} /> Wishlist
                          </Link>
                          <Link to="/account?tab=toko" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-500 transition-colors">
                            <Store size={18} /> Toko Favorit
                          </Link>
                          <Link to="/account" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-500 transition-colors">
                            <Settings size={18} /> Pengaturan
                          </Link>
                       </div>

                       <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors pt-4 border-t border-gray-50"
                       >
                        Keluar <LogOut size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-3 h-full">
            <Link to="/login" className="px-4 py-1.5 border border-green-500 text-green-500 font-bold rounded-lg text-sm hover:bg-green-50 transition-colors">Masuk</Link>
            <Link to="/register" className="px-4 py-1.5 bg-green-500 text-white font-bold rounded-lg text-sm hover:bg-green-600 shadow-sm transition-colors">Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavIcon({ icon, count, to = "#" }) {
  return (
    <div className="group h-full flex items-center px-2 cursor-pointer relative">
      <Link to={to} className="relative text-gray-600 group-hover:text-green-500 transition-colors">
        {icon}
        {count > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-white">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}

function AccountMiniLink({ icon, label, action, value }) {
  return (
    <div className="flex items-center justify-between group/item cursor-pointer">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-gray-700 group-hover/item:text-green-500">{label}</span>
      </div>
      {action && <span className="text-[10px] font-bold text-green-500 hover:underline">{action}</span>}
      {value && <span className="text-xs font-bold text-gray-800">{value}</span>}
    </div>
  );
}