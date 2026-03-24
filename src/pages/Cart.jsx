import { useState } from 'react';
import { Trash2, Minus, Plus, Ticket, Store, Wallet, Check, ShoppingBag, X, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi
import useCartStore from '../stores/useCartStore';

export default function Cart() {
  const navigate = useNavigate(); // Inisialisasi navigasi
  const { cartItems, updateQty, removeItem, promo, applyPromo, removePromo } = useCartStore();
  const [selectedItems, setSelectedItems] = useState([]); 
  const [promoInput, setPromoInput] = useState('');

  // Fungsi untuk memilih/centang produk individual
  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // Fungsi untuk memilih semua produk sekaligus
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); 
    } else {
      setSelectedItems(cartItems.map(item => item.id)); 
    }
  };

  // Fungsi navigasi ke halaman checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Perhitungan harga berdasarkan barang yang dipilih
  const subtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + (item.price * item.qty), 0);

  const discountNominal = (promo && promo.isActive) ? (subtotal * promo.discount) : 0;
  const totalHarga = subtotal - discountNominal;

  // Fungsi untuk memverifikasi voucher
  const handleApplyVoucher = () => {
    if (promoInput.toUpperCase() === "GABUTHEMAT") {
      applyPromo("GABUTHEMAT");
    } else {
      alert("Kode voucher tidak valid.");
    }
  };

  // Tampilan jika keranjang benar-benar kosong
  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag size={80} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Keranjangmu kosong</h2>
        <Link to="/" className="bg-green-500 text-white px-8 py-2 rounded-lg font-bold mt-6 hover:bg-green-600 transition-colors">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pt-28 pb-16 px-4 animate-in fade-in duration-300">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Keranjang</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* KOLOM KIRI: DAFTAR BARANG */}
        <div className="w-full lg:flex-1 space-y-6">
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
            <label className="flex items-center gap-4 cursor-pointer text-sm font-medium text-gray-600">
              <input type="checkbox" className="w-5 h-5 accent-green-500 rounded border-gray-300"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={handleSelectAll} />
              Pilih Semua ({cartItems.length})
            </label>
            {selectedItems.length > 0 && (
              <button className="text-green-500 font-bold text-sm hover:underline">Hapus</button>
            )}
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 relative">
                <input type="checkbox" className="w-5 h-5 accent-green-500 rounded border-gray-300"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)} />
                <Store size={16} className="text-gray-700" />
                <span className="font-bold text-gray-800 text-sm">{item.store || "MarketKu Official"}</span>
              </div>

              <div className="p-5 flex gap-4">
                <div className="flex items-center">
                  <input type="checkbox" className="w-5 h-5 accent-green-500 rounded border-gray-300"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)} />
                </div>
                
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100 shrink-0" />
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm text-gray-800 line-clamp-2 pr-4 flex-1">{item.name}</h3>
                    <p className="font-bold text-gray-900 text-sm whitespace-nowrap">
                      Rp{parseInt(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button className="text-[12px] text-green-500 font-bold hover:underline">Tulis Catatan</button>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-gray-300">
                         <button className="hover:text-red-500 transition-colors"><Heart size={20} /></button>
                         <button onClick={() => removeItem(item.id)} className="hover:text-red-500 transition-colors">
                           <Trash2 size={20} />
                         </button>
                      </div>

                      <div className="flex items-center border border-gray-300 rounded-lg h-8 overflow-hidden bg-white">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled={item.qty <= 1}>
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-xs text-gray-700">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 hover:bg-gray-100 text-green-500">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KOLOM KANAN: RINGKASAN BELANJA */}
        <div className="w-full lg:w-[350px] lg:sticky lg:top-28">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-4">
            
            <div className="border-b border-gray-100 pb-4">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Kupon & Promo</p>
              {!promo.isActive ? (
                <div className="flex gap-2">
                  <input type="text" placeholder="Masukkan kode promo" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold uppercase outline-none focus:border-green-500 transition-all"
                    value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
                  <button onClick={handleApplyVoucher} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">PAKAI</button>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    <span className="text-xs font-bold text-gray-800">{promo.code}</span>
                  </div>
                  <button onClick={removePromo} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                </div>
              )}
            </div>

            <p className="text-sm font-bold text-gray-800">Ringkasan belanja</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Total Harga ({selectedItems.length} barang)</span>
                <span>Rp{subtotal.toLocaleString('id-ID')}</span>
              </div>
              {promo.isActive && (
                <div className="flex justify-between text-red-500 font-medium">
                  <span>Diskon 10%</span>
                  <span>- Rp{discountNominal.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total Harga</span>
              <span className="font-bold text-lg text-gray-900">Rp{totalHarga.toLocaleString('id-ID')}</span>
            </div>

            {/* UPGRADE: Penambahan fungsi onClick handleCheckout */}
            <button 
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
              className="w-full bg-green-500 text-white font-bold h-11 rounded-lg shadow-md hover:bg-green-600 transition-all disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Beli ({selectedItems.length})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}