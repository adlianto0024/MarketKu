import { useState, useEffect } from 'react';
import { MapPin, Plus, X, Search, Crosshair, ChevronLeft, Check, Share2, Map, Trash2, Loader2 } from 'lucide-react';
import useAddressStore from '../../stores/useAddressStore';

export default function AlamatTab() {
  const { addresses, addAddress, updateAddress, deleteAddress, setMainAddress } = useAddressStore();
  const [activeTab, setActiveTab] = useState('semua');
  
  // State Modal & Wizard
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editId, setEditId] = useState(null);
  const [cancelPopup, setCancelPopup] = useState(false);

  // State Pencarian API & GPS
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem('search_history')) || []
  );

  const [formData, setFormData] = useState({
    label: '', receiver: '', phone: '', fullAddress: '', note: '', pinpoint: 'Jakarta, Indonesia', isMain: false, termsAccepted: false
  });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditId(address.id);
      setFormData({ ...address, termsAccepted: true });
      setStep(3);
    } else {
      setEditId(null);
      setFormData({ label: '', receiver: '', phone: '', fullAddress: '', note: '', pinpoint: 'Jakarta, Indonesia', isMain: false, termsAccepted: false });
      setStep(1);
      setSearchKeyword('');
      setSearchResults([]);
    }
    setModalOpen(true);
  };

  const handleCloseAttempt = () => setCancelPopup(true);
  const confirmClose = () => { setCancelPopup(false); setModalOpen(false); };
  const continueManual = () => { setCancelPopup(false); setStep(3); };

  const handleSave = () => {
    if (!formData.label || !formData.receiver || !formData.fullAddress || !formData.phone) {
      alert("Harap isi Label, Nama Penerima, Nomor HP, dan Alamat Lengkap terlebih dahulu.");
      return;
    }
    if (!formData.termsAccepted) {
      alert("Centang persetujuan Syarat & Ketentuan untuk menyimpan.");
      return;
    }

    if (editId) updateAddress(editId, formData);
    else addAddress(formData);
    
    setModalOpen(false);
  };

  const selectLocation = (locationName) => {
    setFormData({ ...formData, pinpoint: locationName });
    const newHistory = [{ name: locationName }, ...searchHistory.filter(h => h.name !== locationName)].slice(0, 3);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    setStep(2);
  };

  const deleteHistory = (index) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  useEffect(() => {
    if (searchKeyword.length > 2) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchKeyword}&countrycodes=id&limit=5`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setIsSearching(false);
          })
          .catch(() => setIsSearching(false));
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchKeyword]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung fitur lokasi.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const locName = data.display_name || 'Lokasi Saya';
          selectLocation(locName);
        } catch (e) {
          selectLocation(`${latitude}, ${longitude}`);
        }
      },
      () => alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.')
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER & PENCARIAN ALAMAT LUAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-[350px]">
           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
           <input type="text" placeholder="Tulis Nama Alamat / Kota / Kecamatan" 
             className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:border-green-500 outline-none" />
        </div>
        <button onClick={() => handleOpenModal()} className="bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors shrink-0">
          + Tambah Alamat Baru
        </button>
      </div>

      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab('semua')} className={`pb-3 text-sm font-bold border-b-2 ${activeTab === 'semua' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-500'}`}>Semua Alamat</button>
        <button onClick={() => setActiveTab('teman')} className={`pb-3 text-sm font-bold border-b-2 ${activeTab === 'teman' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-500'}`}>Dari Teman</button>
      </div>

      {/* LIST ALAMAT */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-xl bg-gray-50">
            <p className="text-sm font-bold text-gray-800">Belum ada alamat</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className={`p-5 rounded-xl border flex justify-between items-start ${addr.isMain ? 'border-green-500 bg-green-50/20' : 'border-gray-200 bg-white'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-600 text-sm">{addr.label}</span>
                  {addr.isMain && <span className="bg-green-100 text-green-600 text-[10px] px-2 py-0.5 rounded font-bold">Utama</span>}
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-0.5">{addr.receiver}</h4>
                <p className="text-sm text-gray-600 mb-0.5">{addr.phone}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{addr.fullAddress}</p>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <MapPin size={14} className="text-gray-400" /> Sudah Pinpoint
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="text-sm font-bold text-gray-600 flex items-center gap-1 hover:text-green-500"><Share2 size={16}/> Share</button>
                  <button onClick={() => handleOpenModal(addr)} className="text-sm font-bold text-green-600 hover:text-green-700">Ubah Alamat</button>
                  <button onClick={() => { if(confirm('Hapus alamat?')) deleteAddress(addr.id); }} className="text-sm font-bold text-gray-400 hover:text-red-500">Hapus</button>
                </div>
              </div>
              
              <div className="ml-4 shrink-0 mt-1">
                {addr.isMain ? (
                  <Check size={28} strokeWidth={3} className="text-green-500" />
                ) : (
                  <button onClick={() => setMainAddress(addr.id)} className="border border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-500 px-4 py-1.5 rounded-lg text-xs font-bold bg-white transition-colors">
                    Jadikan Utama
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* WIZARD MODAL 3 TAHAPAN */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-[550px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                {step > 1 && !editId && <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-800"><ChevronLeft size={24} /></button>}
                <h2 className="text-lg font-bold text-gray-800">Tambah Alamat</h2>
              </div>
              <button onClick={handleCloseAttempt} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            {!editId && (
              <div className="px-10 py-4 flex items-center justify-between relative shrink-0">
                <div className="absolute left-16 right-16 top-6 h-[1px] bg-gray-300 -z-10"></div>
                {[1, 2, 3].map(num => (
                  <div key={num} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= num ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {step > num ? <Check size={14} /> : num}
                    </div>
                    <span className={`text-[10px] font-medium ${step >= num ? 'text-gray-800' : 'text-gray-400'}`}>{num === 1 ? 'Cari lokasi' : num === 2 ? 'Tentukan pinpoint' : 'Detail alamat'}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 pt-2 flex-1 overflow-y-auto custom-scrollbar border-t border-gray-100">
              
              {/* --- TAHAP 1 --- */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Di mana lokasi tujuan pengirimanmu?</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tulis nama jalan / gedung / perumahan" 
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-green-500 outline-none" 
                    />
                    {isSearching && <Loader2 className="absolute right-3 top-3.5 text-green-500 animate-spin" size={18} />}
                  </div>
                  <button onClick={handleGetLocation} className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Crosshair className="text-gray-400" size={18} />
                    <span className="text-sm font-bold text-gray-600">Gunakan Lokasi Saat Ini</span>
                  </button>
                  
                  <div className="pt-2">
                    {searchKeyword.length > 2 ? (
                       <div className="border-t border-gray-100 pt-2">
                         <p className="text-xs text-gray-400 mb-2 font-medium">Hasil Pencarian:</p>
                         {searchResults.map((loc, i) => (
                           <div key={i} onClick={() => selectLocation(loc.display_name)} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                             <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
                             <div>
                               <p className="text-sm font-bold text-gray-800">{loc.display_name.split(',')[0]}</p>
                               <p className="text-xs text-gray-500">{loc.display_name}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                    ) : (
                       searchHistory.length > 0 && (
                         <div className="border-t border-gray-100 pt-2">
                           <p className="text-xs text-gray-400 mb-2 font-medium">Pencarian Terakhir</p>
                           {searchHistory.map((history, i) => (
                             <div key={i} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group">
                               <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
                               <div className="flex-1" onClick={() => selectLocation(history.name)}>
                                 <p className="text-sm font-bold text-gray-800 line-clamp-1">{history.name}</p>
                               </div>
                               <button onClick={(e) => { e.stopPropagation(); deleteHistory(i); }} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ))}
                         </div>
                       )
                    )}
                  </div>
                </div>
              )}

              {/* --- TAHAP 2 (MAP GOOGLE EMBED DIPERBAIKI) --- */}
              {step === 2 && (
                <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Tentukan titik pinpoint lokasi kamu</h3>
                  
                  <div className="relative w-full h-[280px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-4">
                    
                    {/* Google Maps URL Diperbaiki */}
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.pinpoint)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                      className="absolute inset-0 pointer-events-auto"
                    ></iframe>

                    {/* Ikon Pinpoint di Tengah Peta */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none drop-shadow-xl flex flex-col items-center">
                      <MapPin size={48} className="text-green-500 fill-white" />
                      {/* Animasi titik akurasi */}
                      <div className="w-2 h-2 bg-green-500/50 rounded-full absolute -bottom-1 animate-ping"></div>
                    </div>

                    {/* Tombol Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex gap-2 pointer-events-none">
                       <button onClick={handleGetLocation} className="bg-white px-3 py-2 rounded-lg shadow-md text-xs font-bold flex items-center gap-2 border border-gray-200 text-gray-600 pointer-events-auto hover:bg-gray-50">
                         <Crosshair size={14}/> Gunakan Lokasi Saat Ini
                       </button>
                       <button onClick={() => setStep(1)} className="bg-white px-3 py-2 rounded-lg shadow-md text-xs font-bold flex items-center justify-center gap-2 border border-gray-200 text-gray-600 flex-1 pointer-events-auto hover:bg-gray-50">
                         <Search size={14}/> Cari Ulang
                       </button>
                    </div>

                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-4">
                    <p className="font-bold text-gray-800 text-sm line-clamp-1">{formData.pinpoint}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Pastikan titik peta sesuai dengan alamatmu.</p>
                  </div>
                  <button onClick={() => setStep(3)} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 mt-auto shrink-0">
                    Pilih Lokasi & Lanjut Isi Alamat
                  </button>
                </div>
              )}

              {/* --- TAHAP 3 --- */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-2">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Lengkapi detail alamat</h3>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pinpoint</p>
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => setStep(2)}>
                      <MapPin size={16} className="text-gray-400 shrink-0" />
                      <span className="text-gray-800 font-medium line-clamp-1">{formData.pinpoint}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-500">Label Alamat</label>
                    <input type="text" maxLength={30} value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-green-500 outline-none" />
                    <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">{formData.label.length}/30</span>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-500">Alamat Lengkap</label>
                    <textarea rows="3" maxLength={200} value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-green-500 outline-none resize-none"></textarea>
                    <span className="absolute bottom-3 right-3 text-[10px] text-gray-400">{formData.fullAddress.length}/200</span>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-500">Catatan Untuk Kurir (Opsional)</label>
                    <input type="text" maxLength={45} placeholder="Warna rumah, patokan, pesan khusus, dll." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-green-500 outline-none" />
                    <span className="absolute bottom-3 right-3 text-[10px] text-gray-400">{formData.note.length}/45</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-500">Nama Penerima</label>
                      <input type="text" maxLength={50} value={formData.receiver} onChange={e => setFormData({...formData, receiver: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-500">Nomor HP</label>
                      <input type="text" maxLength={15} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-green-500 outline-none" />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer mt-6">
                    <input type="checkbox" checked={formData.isMain} onChange={e => setFormData({...formData, isMain: e.target.checked})} className="w-5 h-5 accent-green-500 rounded border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Jadikan alamat utama</span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer mt-2">
                    <input type="checkbox" checked={formData.termsAccepted} onChange={e => setFormData({...formData, termsAccepted: e.target.checked})} className="w-5 h-5 accent-green-500 rounded mt-0.5 border-gray-300" />
                    <span className="text-xs text-gray-500 leading-relaxed">Saya menyetujui Syarat & Ketentuan.</span>
                  </label>

                  <div className="sticky bottom-0 bg-white pt-2 pb-2 border-t border-gray-100 mt-4">
                    <button onClick={handleSave} className={`w-full py-3 mt-4 rounded-lg font-bold transition-colors ${formData.termsAccepted ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400'}`}>Simpan Alamat</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP BATAL */}
      {cancelPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60">
           <div className="bg-white w-full max-w-[450px] rounded-xl text-center shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="w-full h-32 bg-green-50 flex items-center justify-center border-b border-gray-100">
               <Map size={64} className="text-green-300" />
             </div>
             <div className="p-6">
               <h3 className="font-bold text-lg mb-2 text-gray-800">Sulit menemukan alamatmu yang tepat?</h3>
               <p className="text-sm text-gray-600 mb-8">Tenang, kamu bisa isi alamat secara manual.</p>
               <div className="flex gap-3">
                 <button onClick={confirmClose} className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Keluar</button>
                 <button onClick={continueManual} className="flex-1 py-3 bg-green-500 rounded-lg text-sm font-bold text-white hover:bg-green-600">Isi Alamat Manual</button>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}