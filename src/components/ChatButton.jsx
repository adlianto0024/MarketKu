import { useState } from 'react';
import { BotMessageSquare, X, SendHorizontal, Zap, PackageSearch } from 'lucide-react';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const botOptions = [
    { id: 1, label: 'Lacak Pesanan', icon: <PackageSearch size={14} /> },
    { id: 2, label: 'Promo Hari Ini', icon: <Zap size={14} /> },
    { id: 3, label: 'Cara Belanja', icon: null },
    { id: 4, label: 'Bicara ke Agen', icon: null },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] group">
      <div className={`absolute bottom-20 right-0 w-[360px] md:w-[400px] h-[500px] bg-white rounded-3xl overflow-hidden flex flex-col origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_10px_40px_rgba(0,0,0,0.12),0_15px_60px_rgba(0,0,0,0.08)] ${
        isOpen 
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
          : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
      }`}>
          
          <div className="p-5 bg-green-500 text-white flex items-center justify-between border-b border-green-600 shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-full">
                <BotMessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-base leading-tight">Bot MarketKu</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2.5 h-2.5 bg-green-200 rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-medium text-green-100 tracking-wide uppercase">Siap Membantu</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-green-600 rounded-lg transition-colors"
            >
              <X size={22} className="text-white" />
            </button>
          </div>

          <div className="flex-1 bg-gray-50 p-5 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            
            <div className="flex gap-2 items-start animate-in fade-in duration-500">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 shrink-0 border border-green-200 shadow-sm">
                    <BotMessageSquare size={16} className="text-green-600"/>
                </div>
                <div className="p-3.5 rounded-2xl rounded-bl-none bg-white max-w-[80%] text-sm text-gray-700 shadow-sm border border-gray-100 leading-relaxed">
                    Hai <span className="font-bold text-gray-800">Bell</span>! 👋 Selamat datang di MarketKu Care. Ada yang bisa Bot bantu hari ini?
                </div>
            </div>

            <div className="flex gap-2 items-start animate-in fade-in duration-500 delay-150">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 shrink-0 border border-green-200 shadow-sm">
                    <BotMessageSquare size={16} className="text-green-600"/>
                </div>
                <div className="p-3.5 rounded-2xl rounded-bl-none bg-white max-w-[80%] text-sm text-gray-700 shadow-sm border border-gray-100 leading-relaxed">
                    Pilih topik di bawah atau ketik pertanyamu di kolom pesan, ya.
                </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-3 border-t border-gray-100">
                {botOptions.map((option, index) => (
                    <button 
                        key={option.id} 
                        className={`flex items-center gap-1.5 px-4 py-2 border border-green-500 text-green-600 text-xs font-bold rounded-full hover:bg-green-50 hover:shadow-sm active:scale-95 transition-all animate-in fade-in slide-in-from-right-2 duration-300`}
                        style={{ animationDelay: `${200 + index * 50}ms` }}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>

          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 shrink-0">
            <input 
                type="text" 
                placeholder="Tulis pertanyamu di sini..." 
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100 transition-all bg-gray-50"
            />
            <button className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-95 transition-all shadow-sm">
                <SendHorizontal size={18} />
            </button>
          </div>

      </div>

      <div className={`absolute bottom-full right-0 mb-4 bg-white border border-gray-100 p-3 rounded-2xl whitespace-nowrap shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out origin-bottom ${
        isOpen
          ? 'opacity-0 translate-y-2 scale-90'
          : 'opacity-0 translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
      }`}>
        <span className="text-xs font-bold text-gray-700">Tanya Bot MarketKu 👋</span>
        <div className="absolute top-full right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100 -translate-y-1.5"></div>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-green-100 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.08)] ${
          isOpen 
          ? 'bg-green-500 border border-green-600 shadow-[0_10px_35px_rgba(22,163,74,0.4)] hover:bg-green-600 rotate-[-90deg]' 
          : 'bg-white border-2 border-green-100 hover:border-green-400 hover:-translate-y-1'
        }`}
      >
        <div className={`transition-transform duration-500 ease-out ${isOpen ? 'rotate-[90deg]' : ''}`}>
          {isOpen ? (
            <X size={26} className="text-white" strokeWidth={3} />
          ) : (
             <BotMessageSquare size={26} className="text-green-500 fill-green-500/10" />
          )}
        </div>
        
        <div className={`absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md transition-all duration-300 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100 animate-pulse'}`}>
          1
        </div>
      </button>
      
    </div>
  );
}