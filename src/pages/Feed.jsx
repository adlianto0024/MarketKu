import { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Feed() {
  // Data dummy untuk Feed Video
  const [videos] = useState([
    {
      id: 1,
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // Video placeholder 1
      product_id: 1,
      title: "Unboxing Samsung S24 Ultra! 🔥",
      shop: "MarketMVP Official",
      likes: "12.4K",
      comments: "342",
      description: "Super mulus banget titaniumnya! Wajib checkout sekarang mumpung promo."
    },
    {
      id: 2,
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", // Video placeholder 2
      product_id: 12, // ID Macbook misalnya
      title: "Kerja lebih ngebut pakai M2 🚀",
      shop: "Apple Authorised",
      likes: "45.1K",
      comments: "1.2K",
      description: "Baterai awet seharian, rendering video cuma hitungan detik."
    },
    {
      id: 3,
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // Video placeholder 3
      product_id: 5,
      title: "Tes Gaming POCO X6 Pro 🎮",
      shop: "Poco Store",
      likes: "8.9K",
      comments: "124",
      description: "Rata kanan semua game berat! Suhu tetap adem."
    }
  ]);

  return (
    // Memastikan tinggi kontainer adalah 100vh dikurangi tinggi Navbar, dan mengaktifkan snap scrolling
    <div className="h-[calc(100vh-64px)] bg-black overflow-y-scroll snap-y snap-mandatory relative">
      
      {videos.map((video) => (
        <FeedVideo key={video.id} video={video} />
      ))}

    </div>
  );
}

// Komponen terpisah untuk setiap video agar lebih rapi
function FeedVideo({ video }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    // Setiap video akan snap penuh 1 layar
    <div className="h-[calc(100vh-64px)] w-full snap-start relative flex justify-center bg-black">
      
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full max-w-[500px] object-cover cursor-pointer"
        onClick={togglePlay}
        loop
      />

      {/* Play/Pause Overlay Icon (Hanya muncul saat pause) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
        </div>
      )}

      {/* Info Overlay (Bawah Kiri) */}
      <div className="absolute bottom-0 left-0 p-4 w-full max-w-[500px] pb-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end pointer-events-none">
        <h3 className="text-white font-bold text-lg pointer-events-auto">@{video.shop}</h3>
        <p className="text-white/90 text-sm mt-1 mb-3 font-medium">{video.title}</p>
        <p className="text-white/80 text-xs mb-4 line-clamp-2">{video.description}</p>
        
        {/* Link ke Produk Asli */}
        <Link 
          to={`/product/${video.product_id}`}
          className="bg-white/20 backdrop-blur-md rounded-lg p-2 flex items-center gap-3 w-max pointer-events-auto hover:bg-white/30 transition-colors border border-white/10"
        >
          <div className="bg-green-500 p-1.5 rounded-md text-white">
            <ShoppingBag size={16} />
          </div>
          <span className="text-white text-xs font-bold mr-2">Beli Sekarang</span>
        </Link>
      </div>

      {/* Action Buttons Overlay (Kanan) */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 pointer-events-auto z-10">
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors backdrop-blur-sm">
            <Heart size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">{video.likes}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors backdrop-blur-sm">
            <MessageCircle size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">{video.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors backdrop-blur-sm">
            <Share2 size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
        </div>
      </div>

    </div>
  );
}