import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const [contents, setContents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    const [newContent, setNewContent] = useState({
        customer_id: '',
        platform: 'Instagram',
        icerik: '',
        tarih: '',
        durum: 'Taslak'
    });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [contentRes, customerRes] = await Promise.all([
                axios.get('http://localhost:5000/api/content-plans', { 
                    headers: { Authorization: `Bearer ${token}` } 
                }),
                axios.get('http://localhost:5000/api/customers', { 
                    headers: { Authorization: `Bearer ${token}` } 
                })
            ]);
            setContents(contentRes.data);
            setCustomers(customerRes.data);
        } catch (error) {
            console.error("Takvim verileri yüklenemedi");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Platformlara göre özel renkli rozetler (UI/UX Dokunuşu)
    const getPlatformBadge = (platform) => {
        const styles = {
            Instagram: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white",
            LinkedIn: "bg-blue-700 text-white",
            TikTok: "bg-black text-white",
            Facebook: "bg-blue-600 text-white",
            X: "bg-slate-900 text-white"
        };

        return (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${styles[platform] || 'bg-slate-200'}`}>
                {platform}
            </span>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/content-plans', newContent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            fetchData();
            setNewContent({ customer_id: '', platform: 'Instagram', icerik: '', tarih: '', durum: 'Taslak' });
        } catch (error) {
            alert("İçerik planlanırken bir hata oluştu.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 sticky top-0 h-screen">
                <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight text-center">AJANS CRM</div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => navigate('/dashboard')} className="w-full text-left py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 transition-all flex items-center gap-3">🏠 Müşteriler</button>
                    <button className="w-full text-left py-3 px-4 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-500/20 flex items-center gap-3">📅 İçerik Takvimi</button>
                    <button className="w-full text-left py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 transition-all flex items-center gap-3">📋 Görevler</button>
                </nav>
            </aside>

            {/* Ana İçerik */}
            <main className="flex-1 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">İçerik Takvimi</h1>
                        <p className="text-slate-500 mt-2 font-medium">Sosyal medya içerik planını buradan yönetin.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all font-bold flex items-center gap-2"
                    >
                        <span>+</span> Yeni İçerik Planla
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contents.length > 0 ? contents.map((item) => (
                        <div key={item.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                                    {item.tarih}
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                                    item.durum === 'Yayınlandı' ? 'bg-green-100 text-green-700' : 
                                    item.durum === 'Onaylandı' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {item.durum}
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-3">{item.Customer?.firma_adi}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6 line-clamp-4">{item.icerik}</p>
                            
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getPlatformBadge(item.platform)}
                                </div>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Hazırlanıyor</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                            <p className="text-slate-400 font-bold text-lg">Henüz planlanmış bir içerik bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Ekleme Modalı */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-white/20">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight text-center">İçerik Planla</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setNewContent({...newContent, customer_id: e.target.value})}
                                required
                            >
                                <option value="">Müşteri Seçin</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.firma_adi}</option>)}
                            </select>

                            <div className="grid grid-cols-2 gap-4">
                                <select 
                                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onChange={(e) => setNewContent({...newContent, platform: e.target.value})}
                                >
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="X">X (Twitter)</option>
                                </select>
                                <input 
                                    type="date" 
                                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onChange={(e) => setNewContent({...newContent, tarih: e.target.value})}
                                    required
                                />
                            </div>

                            <textarea 
                                placeholder="İçerik detaylarını buraya yazın..."
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl min-h-[140px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setNewContent({...newContent, icerik: e.target.value})}
                                required
                            />

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all">KAYDET</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">İPTAL</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;