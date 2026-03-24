import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Plus, Minus, Store,
  MessageSquareText, ShieldCheck, ChevronRight,
  Heart, Share2, PackageSearch, MessageCircle, ShoppingCart, X, CheckCircle
} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import api from '../services/api';
import useWishlistStore from '../stores/useWishlistStore';
import useAuthStore from '../stores/useAuthStore';
import useCartStore from '../stores/useCartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Detail Produk');

  const [toast, setToast] = useState({ visible: false, message: '', type: 'add' });

  const { user } = useAuthStore();
  const { wishlistItems, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const isFavorite = wishlistItems.some(item => item.id === parseInt(id));

  const showToast = (message, type = 'add') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'add' });
    }, 3000);
  };

  const handleWishlist = () => {
    if (!user) {
      showToast('Kamu harus login dulu untuk menambah wishlist!', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category
    });

    showToast(isFavorite ? 'Dihapus dari Wishlist' : 'Berhasil ditambah ke Wishlist!', isFavorite ? 'remove' : 'add');
  };

  const handleAddToCart = () => {
    if (!user) {
      showToast('Kamu harus login dulu untuk belanja!', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      qty: qty,
      category: product.category,
      store: "MarketKu Official Store"
    });

    showToast('Berhasil masuk keranjang!', 'add');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data ? response.data.data : response.data);
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-40 text-gray-500 font-bold">Produk tidak ditemukan.</div>
  );

  const tabs = ['Detail Produk', 'Spesifikasi', 'Ulasan', 'Rekomendasi'];

  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto min-h-screen bg-white relative">

      {toast.visible && (
        <div className={`fixed top-32 right-8 z-[100] flex items-center gap-3 p-4 rounded-xl border shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'add' ? 'bg-green-50 border-green-200 text-green-700' :
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
          {toast.type === 'add' && <CheckCircle size={20} />}
          {toast.type === 'error' && <ShoppingCart size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
          <button onClick={() => setToast({ ...toast, visible: false })} className="ml-2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-[348px] md:sticky md:top-32 shrink-0">
          <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white mb-4">
            <LazyLoadImage alt={product.name} src={product.image_url} effect="blur" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <div className="w-14 h-14 rounded-lg border-2 border-green-500 overflow-hidden cursor-pointer">
              <img src={product.image_url} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-800 leading-tight mb-2 uppercase">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm mb-4">
            <span>Terjual <span className="text-gray-500">100+</span></span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /><span className="font-bold text-gray-700">4.9</span><span className="text-gray-400">(50 rating)</span></div>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Rp{parseInt(product.price).toLocaleString('id-ID')}</p>
          <div className="border-b border-gray-200 mb-6 sticky top-28 bg-white z-10">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">{tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-green-500 border-b-4 border-green-500' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>))}</div>
          </div>
          <div className="space-y-10 mb-20">
            {activeTab === 'Detail Produk' && (<section className="animate-in fade-in duration-300"><div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 text-sm mb-6"><p className="text-gray-500">Kondisi: <span className="text-gray-800 font-bold ml-1">Baru</span></p><p className="text-gray-500">Min. Pemesanan: <span className="text-gray-800 font-bold ml-1">1 Buah</span></p><p className="text-gray-500">Kategori: <span className="text-green-500 font-bold ml-1">{product.category}</span></p></div><p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p><div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center overflow-hidden"><Store size={24} className="text-green-600" /></div><div><h4 className="font-bold text-sm text-gray-800">MarketKu Official Store</h4><p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin size={12} /> Jakarta Selatan</p></div></div><button className="px-6 py-2 border border-green-500 text-green-500 font-bold text-xs rounded-xl hover:bg-green-50">Follow</button></div></section>)}
            {activeTab === 'Ulasan' && (<section className="animate-in slide-in-from-bottom-2 duration-300"><h3 className="text-lg font-black text-gray-800 mb-6 uppercase">Ulasan Pembeli</h3><div className="flex items-center gap-10 p-6 bg-gray-50/50 rounded-2xl"><div className="text-center border-r border-gray-200 pr-10"><p className="text-5xl font-black text-gray-800 tracking-tighter">4.9<span className="text-sm text-gray-400 font-medium">/5.0</span></p><p className="text-[10px] font-bold text-gray-500 mt-2">100% pembeli merasa puas</p></div><p className="text-gray-400 text-sm italic">Belum ada ulasan tertulis untuk produk ini.</p></div></section>)}
          </div>
        </div>

        {/* KOLOM 3: SISI KANAN */}
        <div className="w-full md:w-[280px] md:sticky md:top-32 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"><h3 className="font-bold text-gray-800 text-sm mb-4">Atur jumlah dan catatan</h3><div className="flex items-center gap-3 mb-6"><div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm"><button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-1.5 hover:bg-gray-50 text-gray-300" disabled={qty <= 1}><Minus size={18} /></button><input readOnly value={qty} className="w-10 text-center font-black text-sm text-gray-700" /><button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="p-1.5 hover:bg-gray-50 text-green-500" disabled={qty >= product.stock}><Plus size={18} /></button></div><p className="text-xs font-bold text-gray-800">Stok: <span className="text-gray-500">{product.stock}</span></p></div><div className="flex items-center justify-between gap-4 mb-6"><span className="text-sm font-medium text-gray-400">Subtotal</span><span className="font-black text-lg text-gray-900">Rp{(parseInt(product.price) * qty).toLocaleString('id-ID')}</span></div><div className="space-y-2">
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-500 text-white font-black py-2.5 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} /> + Keranjang
            </button>
            <button className="w-full bg-white text-green-500 border-2 border-green-500 font-black py-2.5 rounded-xl hover:bg-green-50 transition-all">Beli Langsung</button></div><div className="flex items-center justify-between gap-1 pt-4 mt-2 border-t border-gray-100"><button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 hover:text-green-500"><MessageCircle size={16} /> Chat</button><div className="w-[1px] h-3 bg-gray-200"></div>
              <button
                onClick={handleWishlist}
                className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-700 hover:text-green-500'
                  }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-red-500' : ''} /> Wishlist
              </button>
              <div className="w-[1px] h-3 bg-gray-200"></div><button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 hover:text-green-500"><Share2 size={16} /> Share</button></div></div><div className="mt-4 flex items-center gap-2 justify-center text-[11px] text-gray-400 font-bold"><ShieldCheck size={14} className="text-blue-500" /><span>Bebas Pengembalian</span></div></div>
      </div>
    </div>
  );
}