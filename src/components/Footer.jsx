import { Facebook, Twitter, Instagram, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6 mt-10">
      <div className="max-w-[1200px] mx-auto px-4">
      
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-base">MarketKu</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="hover:text-green-500 cursor-pointer">Tentang MarketKu</li>
              <li className="hover:text-green-500 cursor-pointer">Hak Kekayaan Intelektual</li>
              <li className="hover:text-green-500 cursor-pointer">Karir</li>
              <li className="hover:text-green-500 cursor-pointer">Blog</li>
              <li className="hover:text-green-500 cursor-pointer">MarketKu Affiliate Program</li>
              <li className="hover:text-green-500 cursor-pointer">MarketKu B2B Digital</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-3">Beli</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="hover:text-green-500 cursor-pointer">Tagihan & Top Up</li>
                <li className="hover:text-green-500 cursor-pointer">MarketKu COD</li>
                <li className="hover:text-green-500 cursor-pointer">Bebas Ongkir</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-3">Jual</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="hover:text-green-500 cursor-pointer">Pusat Edukasi Seller</li>
                <li className="hover:text-green-500 cursor-pointer">Daftar Mall</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-base">Bantuan dan Panduan</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="hover:text-green-500 cursor-pointer">MarketKu Care</li>
              <li className="hover:text-green-500 cursor-pointer">Syarat dan Ketentuan</li>
              <li className="hover:text-green-500 cursor-pointer">Kebijakan Privasi</li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-4">Keamanan & Privasi</h4>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                   <div className="w-16 h-10 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold text-gray-400">PCI DSS COMPLIANT</div>
                   <div className="w-16 h-10 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold text-gray-400">ISO 27001</div>
                </div>
                <div className="w-16 h-10 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold text-gray-400">ISO 9001</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-3">Ikuti Kami</h4>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"><Facebook size={16} fill="currentColor"/></div>
                <div className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"><Twitter size={16} fill="currentColor"/></div>
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"><Instagram size={16} /></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-gray-800 text-base">Nikmatin keuntungan spesial di aplikasi:</h4>
            <div className="space-y-2">
               <BenefitItem icon={<CheckCircle2 size={16} className="text-green-500" />} text="Diskon 70%* hanya di aplikasi" />
               <BenefitItem icon={<CheckCircle2 size={16} className="text-green-500" />} text="Promo khusus aplikasi" />
               <BenefitItem icon={<CheckCircle2 size={16} className="text-green-500" />} text="Gratis Ongkir tiap hari" />
            </div>
            
            <p className="text-xs text-gray-400 pt-2">Buka aplikasi dengan scan QR atau klik tombol:</p>
            <div className="flex gap-3 items-center">
               <div className="w-24 h-24 border border-gray-200 rounded-lg p-1">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MarketKu" alt="QR" className="w-full h-full" />
               </div>
               <div className="flex flex-col gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8 cursor-pointer" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8 cursor-pointer" />
                  <div className="h-8 bg-black rounded flex items-center justify-center px-2 cursor-pointer">
                    <span className="text-white text-[10px] font-bold">AppGallery</span>
                  </div>
               </div>
            </div>
            <button className="text-green-500 text-sm font-bold flex items-center gap-1 hover:underline">Pelajari Selengkapnya →</button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-gray-400">© 2009 - 2026, PT. MarketKu. All Rights Reserved.</p>
           <div className="flex items-center gap-1">
              <button className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg">Indonesia</button>
              <button className="text-gray-400 text-xs font-bold px-4 py-1.5 hover:bg-gray-100 rounded-lg">English</button>
           </div>
        </div>

      </div>
    </footer>
  );
}

function BenefitItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs text-gray-600 font-medium">{text}</span>
    </div>
  );
}