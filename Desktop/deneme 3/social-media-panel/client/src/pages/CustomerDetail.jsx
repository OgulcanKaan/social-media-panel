//Bir müşteriye tıklandığında açılan, o müşterinin sosyal medya hesaplarını ve görevlerini yönettiğin en kapsamlı sayfa.
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [socialAccounts, setSocialAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modallar için State'ler
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    
    // Form State'leri
    const [newAccount, setNewAccount] = useState({ platform: 'Instagram', kullanici_adi: '', url: '' });
    const [editData, setEditData] = useState({});
    const [selectedSocialId, setSelectedSocialId] = useState(null);
    const [newTask, setNewTask] = useState({ baslik: '', planlanan_tarih: '', oncelik: 'orta' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const resCust = await axios.get(`http://localhost:5000/api/customers`, config);
            const found = resCust.data.find(c => c.id === Number(id));
            setCustomer(found);
            setEditData(found);

            const resSocial = await axios.get(`http://localhost:5000/api/social-accounts/customer/${id}`, config);
            
            const accountsWithTasks = await Promise.all(resSocial.data.map(async (acc) => {
                try {
                    const resTasks = await axios.get(`http://localhost:5000/api/tasks?social_account_id=${acc.id}`, config);
                    return { ...acc, tasks: resTasks.data };
                } catch (err) {
                    return { ...acc, tasks: [] };
                }
            }));

            setSocialAccounts(accountsWithTasks);
            setLoading(false);
        } catch (error) {
            navigate('/dashboard');
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/social-accounts', 
                { ...newAccount, customer_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsAccountModalOpen(false);
            fetchData();
        } catch (error) { alert("Hesap eklenemedi!"); }
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/customers/${id}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditModalOpen(false);
            fetchData();
            alert("Bilgiler güncellendi!");
        } catch (error) { alert("Güncelleme hatası!"); }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/tasks', 
                { 
                    ...newTask, 
                    social_account_id: selectedSocialId,
                    customer_id: id 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsTaskModalOpen(false);
            setNewTask({ baslik: '', planlanan_tarih: '', oncelik: 'orta' });
            fetchData();
        } catch (error) { alert("Görev eklenemedi!"); }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) { alert("Görev silinemedi!"); }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-500 uppercase tracking-widest animate-pulse">Veriler Hazırlanıyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center text-blue-600 font-bold hover:gap-2 transition-all">
                <span className="mr-2">←</span> Panele Geri Dön
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SOL: FİRMA BİLGİLERİ */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 h-fit">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Firma Bilgileri</h2>
                        <button 
                            onClick={() => { setEditData(customer); setIsEditModalOpen(true); }} 
                            className="text-blue-600 font-bold text-sm hover:underline"
                        >
                            ✏️ Düzenle
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Firma Adı</span>
                            <p className="text-slate-900 font-bold text-xl">{customer.firma_adi}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Sektör</span>
                            <p className="text-slate-700 font-bold">{customer.sektor || '—'}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">İletişim</span>
                            <p className="text-slate-700 font-bold">{customer.iletisim || '—'}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Durum</span>
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase">{customer.durum}</span>
                        </div>
                    </div>
                </div>

                {/* SAĞ: SOSYAL HESAPLAR VE GÖREVLER */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bağlı Sosyal Hesaplar</h2>
                            <button 
                                onClick={() => setIsAccountModalOpen(true)} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                            >
                                + Hesap Bağla
                            </button>
                        </div>

                        <div className="space-y-6">
                            {socialAccounts.map(account => (
                                <div key={account.id} className="p-8 border border-slate-100 rounded-[32px] bg-slate-50/50">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h4 className="font-black text-slate-900 text-2xl tracking-tight">{account.platform}</h4>
                                            <p className="text-slate-500 font-bold">@{account.kullanici_adi}</p>
                                        </div>
                                        <a href={`https://${account.url}`} target="_blank" rel="noreferrer" className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-blue-600 text-xs font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm">Profili Aç ↗</a>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-slate-200">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Post Planı & Görevler</span>
                                            <button 
                                                onClick={() => { setSelectedSocialId(account.id); setIsTaskModalOpen(true); }}
                                                className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                                            >
                                                + YENİ GÖREV EKLE
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {account.tasks && account.tasks.map(task => (
                                                <div key={task.id} className="group bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-blue-200 transition-all shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        <span className="font-bold text-slate-700 text-sm">{task.baslik}</span>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg uppercase italic">
                                                            {task.son_tarih || task.planlanan_tarih}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleDeleteTask(task.id)}
                                                            className="text-red-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!account.tasks || account.tasks.length === 0) && (
                                                <div className="py-10 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                                    <p className="text-[11px] text-slate-300 font-black uppercase tracking-widest">Henüz bir görev planlanmamış.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALLAR --- */}

            {/* 1. FİRMA DÜZENLEME MODALI */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">Firma Güncelle</h2>
                        <form onSubmit={handleUpdateCustomer} className="space-y-5">
                            <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editData.firma_adi} onChange={(e) => setEditData({...editData, firma_adi: e.target.value})} required placeholder="Firma Adı" />
                            <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editData.sektor} onChange={(e) => setEditData({...editData, sektor: e.target.value})} placeholder="Sektör" />
                            <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editData.iletisim} onChange={(e) => setEditData({...editData, iletisim: e.target.value})} placeholder="İletişim" />
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">GÜNCELLE</button>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">İPTAL</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. HESAP BAĞLAMA MODALI */}
            {isAccountModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">Yeni Hesap</h2>
                        <form onSubmit={handleAddAccount} className="space-y-5">
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold appearance-none" 
                                onChange={(e) => setNewAccount({...newAccount, platform: e.target.value})}
                                value={newAccount.platform}
                            >
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Twitter">Twitter</option>
                            </select>
                            <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Kullanıcı Adı" onChange={(e) => setNewAccount({...newAccount, kullanici_adi: e.target.value})} required />
                            <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Profil URL" onChange={(e) => setNewAccount({...newAccount, url: e.target.value})} required />
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">BAĞLA</button>
                                <button type="button" onClick={() => setIsAccountModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">VAZGEÇ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. GÖREV EKLEME MODALI */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">Görev Planla</h2>
                        <form onSubmit={handleAddTask} className="space-y-6">
                            <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Görev Başlığı (Örn: Reels Yayını)" onChange={(e) => setNewTask({...newTask, baslik: e.target.value})} required />
                            <input type="date" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-600" onChange={(e) => setNewTask({...newTask, planlanan_tarih: e.target.value})} required />
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">KAYDET</button>
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black transition-all">İPTAL</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDetail;