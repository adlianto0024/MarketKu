import { Link } from 'react-router-dom';
import { Heart, Star, Trash2, ChevronRight, PackageSearch, Store } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// Import Store & Auth
import useWishlistStore from '../stores/useWishlistStore';
import useAuthStore from '../stores/useAuthStore';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const { wishlistItems, toggleWishlist } = useWishlistStore();

  // Proteksi Halaman: Jika belum login, jangan tampilkan apa-apa
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-40 px-4 text-center">
        <PackageSearch size={80} className="text-gray-200 mb-6" />
        <h1 className="text-2xl font-black text-gray-800 mb-2">Ops! Kamu belum masuk</h1>
        <p className="text-gray-500 max-w-sm mb-8 text-sm">Silakan login terlebih dahulu untuk melihat daftar barang incaranmu.</p>
        <Link to="/login" className="bg-green-500 text-white font-black px-8 py-3 rounded-full hover:bg-green-600 transition-colors">
          Login Sekarang
        </Link>
      </div>
    );
  }

  return (
    // PT-40 agar tidak tertutup Navbar, Max-w-1200 sesuai Home
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto min-h-screen bg-gray-50/50 relative">
      
      {/* HEADER HALAMAN */}
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
         <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Heart size={30} className="text-red-500 fill-red-500" /> Wishlist Kamu
         </h1>
         <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold">
           {wishlistItems.length} Produk Favorit
         </span>
      </div>

      {/* JIKA WISHLIST KOSONG */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <LazyLoadImage src="https://img.freepik.com/free-vector/empty-concept-illustration_114360-1188.jpg" alt="empty" className="w-64 mix-blend-multiply mb-8" />
          <h2 className="text-2xl font-black text-gray-800 mb-2">Belum ada barang impian?</h2>
          <p className="text-gray-500 max-w-sm mb-10 text-sm leading-relaxed">Yuk, jelajahi ribuan produk menarik di MarketKu dan nyalakan tombol hati pada barang incaranmu!</p>
          <Link to="/" className="bg-green-500 text-white font-black px-12 py-3.5 rounded-full hover:bg-green-600 transition-all flex items-center gap-2">
            Mulai Belanja <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        // GRID PRODUK WISHLIST (Sesuai image_e2a366.jpg)
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {wishlistItems.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full hover:-translate-y-1 hover:border-green-300 relative">
              
              {/* TOMBOL HAPUS DARI WISHLIST */}
              <button 
                onClick={() => toggleWishlist(product)} 
                className="absolute top-2.5 right-2.5 z-20 w-8 h-8 bg-white/70 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center transition-colors border border-gray-100 group-hover:scale-110"
              >
                <Trash2 size={16} />
              </button>

              <Link to={`/product/${product.id}`} className="block flex-1">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <LazyLoadImage alt={product.name} src={product.image_url} effect="blur" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">Favorit</div>
                </div>
                <div className="p-3.5 flex flex-col flex-grow">
                  <p className="text-[10px] text-gray-400 font-medium uppercase mb-1">{product.category}</p>
                  <h3 className="text-gray-700 text-[11px] font-bold leading-snug line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">{product.name}</h3>
                  <p className="mt-auto font-black text-gray-900 text-sm">Rp{parseInt(product.price).toLocaleString('id-ID')}</p>
                </div>
              </Link>
              
              {/* INFO TOKO SIMPLE DI BAWAH */}
              <div className="p-3.5 pt-0 mt-2 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-100"><Store size={14}/></div>
                    <span className="text-[10px] font-bold text-gray-700">Official Store</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}