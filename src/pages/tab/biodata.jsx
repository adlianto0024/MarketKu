import { useState, useRef } from 'react';
import { Camera, Lock, Fingerprint, X } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';

export default function BiodataTab() {
    const { user, updateUser } = useAuthStore();
    const [modal, setModal] = useState({ open: false, type: '', title: '', value: '' });
    const fileInputRef = useRef(null);
    const openModal = (type, title, currentVal) => {
        setModal({ open: true, type, title, value: currentVal || '' });
    };

    const handleSaveModal = () => {
        updateUser({ [modal.type]: modal.value });
        setModal({ open: false, type: '', title: '', value: '' });
    };

    const handlePhotoClick = () => fileInputRef.current.click();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                updateUser({ image: reader.result });
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-12 animate-in fade-in duration-500">

            <div className="w-full md:w-[300px] space-y-6">
                <div className="p-6 border border-gray-100 rounded-xl shadow-sm text-center">
                    <div className="relative group cursor-pointer mb-4" onClick={handlePhotoClick}>
                        <img
                            src={user?.image}
                            className="w-full aspect-square rounded-lg object-cover"
                            alt="profile"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Camera size={32} className="text-white" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <button
                        onClick={handlePhotoClick}
                        className="w-full py-2 border border-gray-200 rounded-lg font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Pilih Foto
                    </button>
                    <p className="text-[10px] text-gray-400 leading-relaxed text-left mt-2">
                        Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
                    </p>
                </div>

                <div className="space-y-2">
                    <SecurityButton label="Buat Kata Sandi" />
                    <SecurityButton label="PIN Tokopedia" icon={<Lock size={14} />} />
                    <SecurityButton label="Verifikasi Instan" icon={<Fingerprint size={14} />} />
                </div>
            </div>

            <div className="flex-1 space-y-10">
                <section>
                    <h3 className="font-bold text-sm text-gray-800 mb-6 uppercase tracking-wider">Ubah Biodata Diri</h3>
                    <div className="space-y-5">
                        <InfoRow
                            label="Nama"
                            value={user?.name}
                            onAction={() => openModal('name', 'Ubah Nama', user?.name)}
                        />
                        <InfoRow
                            label="Tanggal Lahir"
                            value={user?.birthday}
                            placeholder="Tambah Tanggal Lahir"
                            onAction={() => openModal('birthday', 'Ubah Tanggal Lahir', user?.birthday)}
                        />
                        <InfoRow
                            label="Jenis Kelamin"
                            value={user?.gender}
                            placeholder="Tambah Jenis Kelamin"
                            onAction={() => openModal('gender', 'Ubah Jenis Kelamin', user?.gender)}
                        />
                    </div>
                </section>

                <section>
                    <h3 className="font-bold text-sm text-gray-800 mb-6 uppercase tracking-wider">Ubah Kontak</h3>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 w-1/3 font-medium">Email</span>
                            <div className="flex-1 flex items-center gap-3">
                                <span className="font-bold text-gray-800 truncate max-w-[200px]">{user?.email}</span>
                                <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Terverifikasi</span>
                                <button className="text-green-500 font-bold ml-auto text-xs uppercase hover:underline">Ubah</button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 w-1/3 font-medium">Nomor HP</span>
                            <div className="flex-1 flex items-center gap-3">
                                <span className="font-bold text-gray-800">{user?.phone}</span>
                                <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Terverifikasi</span>
                                <button className="text-green-500 font-bold ml-auto text-xs uppercase hover:underline">Ubah</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {modal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl p-8 relative animate-in zoom-in duration-300">
                        <button onClick={() => setModal({ ...modal, open: false })} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">{modal.title}</h2>

                        <div className="space-y-4">
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                {modal.type === 'name'
                                    ? 'Kamu hanya dapat mengubah nama 1 kali lagi. Pastikan nama sudah benar.'
                                    : 'Pastikan data yang kamu masukkan sudah sesuai dengan identitas aslimu.'}
                            </p>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {modal.title.split(' ').slice(1).join(' ')}
                                </label>

                                {modal.type === 'gender' ? (
                                    <select
                                        value={modal.value}
                                        onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 appearance-none bg-white font-bold text-gray-700"
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Pria">Pria</option>
                                        <option value="Wanita">Wanita</option>
                                    </select>
                                ) : (
                                    <input
                                        type={modal.type === 'birthday' ? 'date' : 'text'}
                                        value={modal.value}
                                        onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-green-500"
                                        placeholder={`Masukkan ${modal.title.split(' ').slice(1).join(' ')}...`}
                                    />
                                )}
                                <p className="text-[10px] text-gray-400 italic">Data ini dapat dilihat oleh pengguna lainnya.</p>
                            </div>

                            <button
                                onClick={handleSaveModal}
                                disabled={!modal.value}
                                className={`w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest mt-8 transition-colors ${modal.value ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function InfoRow({ label, value, placeholder, onAction }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 w-1/3 font-medium">{label}</span>
            <div className="flex-1 flex items-center justify-between">
                <span
                    className={`font-bold ${!value ? 'text-green-500 cursor-pointer hover:underline' : 'text-gray-800'}`}
                    onClick={!value ? onAction : null}
                >
                    {value || placeholder}
                </span>
                {value && (
                    <button
                        onClick={onAction}
                        className="text-green-500 font-bold text-xs uppercase hover:underline ml-4"
                    >
                        Ubah
                    </button>
                )}
            </div>
        </div>
    );
}

function SecurityButton({ label, icon }) {
    return (
        <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors">
            {icon} {label}
        </button>
    );
}