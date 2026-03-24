import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Store, CalendarDays, Wallet, PackageCheck, AlertTriangle, CheckCircle, Ticket } from 'lucide-react';
import useCartStore from '../stores/useCartStore';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cartItems, promo } = useCartStore();

    const address = {
        name: 'Bell (081234567890)',
        full: 'JL. GABUTHEMAT NO. 1, JAKARTA SELATAN, 12110',
        type: 'Rumah'
    };

    const shippingOptions = [
        { id: 1, name: 'Reguler (2-4 Hari)', price: 15000 },
        { id: 2, name: 'Ekonomi (4-6 Hari)', price: 10000 },
        { id: 3, name: 'Sameday (Hari Ini)', price: 25000 }
    ];

    const [selectedShipping, setSelectedShipping] = useState(1);
    const [useDompetKu, setUseDompetKu] = useState(true);
    const [asuransiChecked, setAsuransiChecked] = useState(true);
    const dompetKuBalance = 100000000;
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const selectedShippingPrice = shippingOptions.find(opt => opt.id === selectedShipping).price;
    const asuransiPrice = asuransiChecked ? 5000 : 0;

    const discountNominal = (promo && promo.isActive) ? (subtotal * promo.discount) : 0;

    const totalPayment = subtotal + selectedShippingPrice + asuransiPrice - discountNominal;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    if (cartItems.length === 0) return null;

    return (
        <div className="max-w-[1200px] mx-auto pt-28 pb-16 px-4 animate-in fade-in duration-300">

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                <div className="w-full lg:flex-1 space-y-6">
                    <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Pengiriman</h1>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-gray-800">Alamat Pengiriman</h2>
                            <button className="text-green-500 font-bold text-xs hover:underline">Ubah Alamat</button>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-green-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-gray-800">{address.name} <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1 uppercase">{address.type}</span></p>
                                <p className="text-xs text-gray-500 leading-relaxed">{address.full}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        {/* Header Toko */}
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                            <Store size={16} className="text-gray-700" />
                            <span className="font-bold text-gray-800 text-sm">MarketKu Official Store</span>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item.id} className="p-5 flex gap-4 border-b border-gray-100 last:border-0 relative">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xs text-gray-800 line-clamp-1 pr-4">{item.name}</h3>
                                    <p className="font-black text-gray-900 text-sm whitespace-nowrap">
                                        Rp{parseInt(item.price).toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Jumlah: <span className="text-green-600">{item.qty}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2"><PackageCheck size={16} className="text-green-500" /> Kurir Pengiriman</h3>
                            <select
                                value={selectedShipping}
                                onChange={(e) => setSelectedShipping(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-green-500 transition-all"
                            >
                                {shippingOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.name} - Rp{opt.price.toLocaleString('id-ID')}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 italic">Estimasi pengiriman dapat berubah sesuai kondisi kurir.</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2"><AlertTriangle size={16} className="text-green-500" /> Asuransi</h3>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 accent-green-500 rounded border-gray-300 mt-1" checked={asuransiChecked} onChange={(e) => setAsuransiChecked(e.target.checked)} />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-800">Ceklis Asuransi Pengiriman</p>
                                    <p className="text-[10px] text-gray-500 leading-snug">Wajib ceklis asuransi untuk mencegah barang rusak selama pengiriman. Biaya: <span className="text-green-600 font-bold">Rp5.000</span>.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[350px] lg:sticky lg:top-28">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-4">

                        <div className="border-b border-gray-100 pb-4">
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Voucher Toko & Promo</p>
                            {promo.isActive ? (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Ticket size={16} className="text-green-500" />
                                        <span className="text-xs font-bold text-gray-800">{promo.code}</span>
                                    </div>
                                    <CheckCircle size={16} className="text-green-500" />
                                </div>
                            ) : (
                                <div className="text-center p-3 text-xs text-gray-400 bg-gray-50/50 rounded-lg italic">Belum ada promo aktif</div>
                            )}
                        </div>

                        <p className="text-sm font-bold text-gray-800">Ringkasan pembayaran</p>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal ({cartItems.length} barang)</span>
                                <span className="font-bold text-gray-800">Rp{subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Total Ongkos Kirim</span>
                                <span className="font-bold text-gray-800">Rp{selectedShippingPrice.toLocaleString('id-ID')}</span>
                            </div>
                            {asuransiChecked && (
                                <div className="flex justify-between text-gray-500">
                                    <span>Asuransi Pengiriman</span>
                                    <span className="font-bold text-gray-800">Rp{asuransiPrice.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            {promo.isActive && (
                                <div className="flex justify-between text-red-500 font-medium">
                                    <span>Diskon Promo 10%</span>
                                    <span>- Rp{discountNominal.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-800">Total Belanja</span>
                            <span className="font-bold text-lg text-gray-900">Rp{totalPayment.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center gap-3">
                            <Wallet size={20} className="text-blue-500" />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-800 uppercase leading-none mb-1">DompetKu</p>
                                <p className="text-[11px] text-gray-500 font-bold">Saldo: Rp{dompetKuBalance.toLocaleString('id-ID')}</p>
                            </div>
                            <input type="checkbox" className="w-4 h-4 accent-blue-500 cursor-pointer" checked={useDompetKu} onChange={(e) => setUseDompetKu(e.target.checked)} />
                        </div>

                        <button className="w-full bg-green-500 text-white font-bold h-11 rounded-lg shadow-md hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                            Lanjut ke Pembayaran <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}