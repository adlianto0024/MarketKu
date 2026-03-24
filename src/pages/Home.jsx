import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Smartphone, Shirt, Monitor, Star, MapPin, Grid, 
  Phone, Zap, ChevronRight, ChevronLeft 
} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';  
import api from '../services/api';
// Import Store Global
import useProductStore from '../stores/useProductStore';

export default function Home() {
  // Ambil state dari Zustand Store
  const { 
    products, setProducts, addProducts, 
    page, setPage, 
    hasMore, setHasMore 
  } = useProductStore();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const limit = 24;

  // FUNGSI UTAMA: Ambil data nyata dari Backend
  const fetchProducts = async (pageNum, isNewSearch = false) => {
    if (isNewSearch) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await api.get('/products', {
        params: { 
          search: searchQuery,
          page: pageNum,
          limit: limit
        }
      });
      
      const productData = response.data.data ? response.data.data : response.data;
      
      if (isNewSearch) {
        setProducts(productData);
      } else {
        // ANTI-DUPLIKAT: Menyaring data agar tidak ada ID yang sama
        const existingIds = new Set(products.map(p => p.id));
        const uniqueNewData = productData.filter(p => !existingIds.has(p.id));
        addProducts(uniqueNewData);
      }

      // Sembunyikan tombol jika data habis
      if (productData.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // LOGIKA ANTI-REFRESH: Hanya fetch jika data kosong atau sedang mencari
  useEffect(() => {
    if (products.length === 0 || searchQuery) {
      setPage(1);
      fetchProducts(1, true);
    }
    // Jika products.length > 0 dan tidak ada pencarian baru, fetch ditunda (data diambil dari cache)
  }, [searchQuery]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false);
  };

  // State Banner lokal (tetap seperti semula)
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    { id: 1, color: 'bg-purple-600', text: 'Malas belanja ke mal?', sub: 'Coba Official Store, jaminan pasti ori!' },
    { id: 2, color: 'bg-blue-400', text: 'Mau transaksi lebih hemat?', sub: 'Cek promo asyik MarketKu sekarang!' },
    { id: 3, color: 'bg-green-500', text: 'Yuk, belanja di MarketKu!', sub: 'Kualitas terjamin langsung dari database.' }
  ];

  const categories = [
    { name: 'Kategori', icon: <Grid size={20} className="text-green-500" /> },
    { name: 'Handphone', icon: <Smartphone size={20} className="text-blue-500" /> },
    { name: 'Top-Up', icon: <Phone size={20} className="text-orange-500" /> },
    { name: 'Elektronik', icon: <Zap size={20} className="text-yellow-500" /> },
    { name: 'Pakaian', icon: <Shirt size={20} className="text-pink-500" /> },
    { name: 'Komputer', icon: <Monitor size={20} className="text-purple-500" /> },
  ];

  return (
    <div className="pt-28 pb-16 px-4 md:px-8 max-w-[1200px] mx-auto">
      
      {!searchQuery && (
        <>
          {/* Banner Carousel */}
          <section className="relative group overflow-hidden rounded-2xl h-[200px] md:h-[300px] mb-8 shadow-sm">
            <div 
              className="flex h-full transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((b) => (
                <div key={b.id} className={`w-full h-full shrink-0 ${b.color} flex items-center p-8 md:p-12 text-white relative`}>
                  <div className="z-10 max-w-lg">
                    <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">{b.text}</h2>
                    <p className="mb-6 opacity-90 text-sm md:text-base">{b.sub}</p>
                    <Link to="/promo" className="inline-block bg-white text-gray-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                      Cek Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrentSlide(s => (s - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"><ChevronLeft className="text-gray-800" /></button>
            <button onClick={() => setCurrentSlide(s => (s + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"><ChevronRight className="text-gray-800" /></button>
          </section>

          {/* Widget Kategori */}
          <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Kategori Populer</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-green-500 cursor-pointer transition-all">
                  {cat.icon}
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Grid Produk Utama */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-green-500 rounded-full inline-block"></span>
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Rekomendasi Untukmu'}
        </h2>
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white p-3 rounded-lg border border-gray-200 animate-pulse h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 flex flex-col overflow-hidden group hover:-translate-y-1">
              <div className="aspect-square bg-gray-50 w-full relative">
                <LazyLoadImage alt={product.name} src={product.image_url} effect="blur" className="object-cover w-full h-full" />
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">Terlaris</div>
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-gray-700 text-[13px] leading-tight line-clamp-2 mb-1 group-hover:text-green-600">{product.name}</h3>
                <p className="text-gray-900 font-bold text-base mt-auto">Rp{parseInt(product.price).toLocaleString('id-ID')}</p>
                <div className="flex items-center text-gray-500 text-[11px] mt-2 gap-1"><MapPin size={12} /> Jakarta Selatan</div>
                <div className="flex items-center text-gray-500 text-[11px] mt-1 gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" /> 4.9 | Terjual 1rb+</div>
              </div>
            </Link>
          ))}
          {loadingMore && [1, 2, 3, 4].map(n => <div key={n} className="bg-white p-3 rounded-lg border border-gray-200 animate-pulse h-64"></div>)}
        </div>
      )}

      {hasMore && !loading && (
        <div className="mt-12 flex justify-center">
          <button onClick={handleLoadMore} disabled={loadingMore} className="border-2 border-green-500 text-green-500 font-bold px-12 py-2.5 rounded-xl hover:bg-green-50 transition-all active:scale-95 disabled:opacity-50">
            {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}
          </button>
        </div>
      )}
    </div>
  );
}