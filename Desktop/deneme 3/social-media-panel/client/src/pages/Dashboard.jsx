import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [dash, setDash] = useState(null); // Dashboard verileri için yeni state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    
    const [newCustomer, setNewCustomer] = useState({
        firma_adi: '',
        sektor: '',
        iletisim: '',
        notlar: '',
        durum: 'aktif'
    });

    // 1. MÜŞTERİ VERİLERİNİ ÇEK
    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(res.data);
        } catch (error) {
            console.error("Müşteriler yüklenemedi:", error);
            if (error.response?.status === 401) navigate('/');
        }
    };

    // 2. DASHBOARD ÖZET VERİLERİNİ ÇEK
    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDash(res.data);
        } catch (error) {
            console.error("Dashboard verileri çekilemedi:", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchDashboard();
    }, []);

    // 3. MÜŞTERİ SİL
    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        if (!window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/customers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(prev => prev.filter(c => c.id !== id));
            fetchDashboard(); // Rakamlar değiştiği için dashboard'u yenile
        } catch (error) {
            alert("Silme hatası!");
        }
    };

    // 4. YENİ MÜŞTERİ EKLE
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/customers', newCustomer, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(prev => [...prev, res.data.customer]);
            setIsModalOpen(false);
            setNewCustomer({ firma_adi: '', sektor: '', iletisim: '', notlar: '', durum: 'aktif' });
            fetchDashboard(); // Rakamlar değiştiği için dashboard'u yenile
        } catch (error) {
            alert("Ekleme hatası!");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 sticky top-0 h-screen">
                <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight text-center text-blue-400">AJANS CRM</div>
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="w-full text-left py-3 px-4 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-500/20 flex items-center gap-3"
                    >
                        🏠 Müşteriler
                    </button>
                    <button 
                        onClick={() => navigate('/calendar')} 
                        className="w-full text-left py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-3 font-medium"
                    >
                        📅 İçerik Takvimi
                    </button>
                    <button 
                        onClick={() => navigate('/tasks')} 
                        className="w-full text-left py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-3 font-medium"
                    >
                        📋 Görevler
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={() => { localStorage.removeItem('token'); navigate('/'); }} 
                        className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-sm"
                    >
                        Güvenli Çıkış
                    </button>
                </div>
            </aside>

            {/* Ana İçerik */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Müşteri Yönetimi</h1>
                        <p className="text-slate-500 font-medium">Sistemdeki tüm firmaları ve durumlarını takip edin.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 font-bold flex items-center gap-2"
                    >
                        + Yeni Müşteri
                    </button>
                </header>

                {/* İstatistik Kartları (Backend'den Gelen Verilerle) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Toplam Müşteri</p>
                        <h3 className="text-4xl font-black text-slate-900">
                            {dash ? dash.totalCustomers : customers.length}
                        </h3>
                    </div>
                    <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Aktif Firmalar</p>
                        <h3 className="text-4xl font-black text-green-600">
                            {dash ? dash.activeCustomers : customers.filter(c => c.durum === 'aktif').length}
                        </h3>
                    </div>
                    <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Bekleyen Görevler</p>
                        <h3 className="text-4xl font-black text-amber-500">
                            {dash ? dash.pendingTasks : '0'}
                        </h3>
                    </div>
                </div>

                {/* Tablo */}
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Firma Adı</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Sektör</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.map((customer) => (
                                <tr key={customer.id} onClick={() => navigate(`/customer/${customer.id}`)} className="hover:bg-blue-50/40 transition-colors cursor-pointer group">
                                    <td className="px-8 py-6 font-bold text-slate-800">{customer.firma_adi}</td>
                                    <td className="px-8 py-6 text-slate-500 font-medium">{customer.sektor || '—'}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${customer.durum === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {customer.durum}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-4">
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/customer/${customer.id}`); }} className="text-blue-600 hover:text-blue-800 font-black text-sm">DÜZENLE</button>
                                        <button onClick={(e) => handleDelete(e, customer.id)} className="text-red-400 hover:text-red-600 font-black text-sm uppercase">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Yeni Müşteri Modalı */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl border border-white/20">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Yeni Firma</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-900 text-3xl font-light">×</button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Firma Adı</label>
                                <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Örn: Bursa İskender" onChange={(e) => setNewCustomer({...newCustomer, firma_adi: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Sektör</label>
                                <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Örn: Gıda" onChange={(e) => setNewCustomer({...newCustomer, sektor: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Firma Durumu</label>
                                <select 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                    value={newCustomer.durum}
                                    onChange={(e) => setNewCustomer({...newCustomer, durum: e.target.value})}
                                >
                                    <option value="aktif">Aktif Müşteri</option>
                                    <option value="deneme">Deneme Süreci</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4 uppercase tracking-widest">Müşteriyi Kaydet</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;