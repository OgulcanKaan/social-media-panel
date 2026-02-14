//Tüm görevlerin "Yapılacak", "Devam Ediyor" ve "Tamamlandı" sütunlarında listelendiği Kanban yönetim merkezi.
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    // ✅ Tek bir yerden yönet (local mi deploy mu)
    const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Görevler yüklenemedi:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ✅ Durum güncelleme (entegre)
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE_URL}/api/tasks/${taskId}`,
                { durum: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // En garanti yöntem: yeniden çek
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Görev taşınırken hata oluştu!");
        }
    };

    // Veritabanındaki 'enum' değerleri ile ekrandaki başlıkları eşleştiriyoruz
    const columns = [
        { title: 'Yapılacak', dbValue: 'yapilacak' },
        { title: 'Devam Ediyor', dbValue: 'devam_ediyor' },
        { title: 'Tamamlandı', dbValue: 'tamamlandi' }
    ];

    // ✅ Sütunlar arasında ileri/geri durum bulma
    const getPrevStatus = (current) => {
        const idx = columns.findIndex(c => c.dbValue === current);
        if (idx <= 0) return null;
        return columns[idx - 1].dbValue;
    };

    const getNextStatus = (current) => {
        const idx = columns.findIndex(c => c.dbValue === current);
        if (idx === -1 || idx >= columns.length - 1) return null;
        return columns[idx + 1].dbValue;
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 sticky top-0 h-screen">
                <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight text-center text-blue-400">
                    AJANS CRM
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-left py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 transition-all flex items-center gap-3"
                    >
                        🏠 Müşteriler
                    </button>
                    <button
                        onClick={() => navigate('/calendar')}
                        className="w-full text-left py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 transition-all flex items-center gap-3"
                    >
                        📅 İçerik Takvimi
                    </button>
                    <button
                        className="w-full text-left py-3 px-4 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-500/20 flex items-center gap-3"
                    >
                        📋 Görevler
                    </button>
                </nav>
            </aside>

            {/* Kanban Görünümü */}
            <main className="flex-1 p-10 overflow-x-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Görev Yönetimi</h1>
                        <p className="text-slate-500 font-medium">Ekip içi iş akışını ve görev durumlarını takip edin.</p>
                    </div>
                </header>

                <div className="flex gap-6 min-w-max">
                    {columns.map(col => (
                        <div
                            key={col.dbValue}
                            className="w-80 bg-slate-200/40 p-5 rounded-[32px] min-h-[600px] border border-slate-200/50"
                        >
                            <h2 className="font-black text-slate-400 mb-6 px-3 uppercase text-[10px] tracking-[0.2em]">
                                {col.title} — {tasks.filter(t => t.durum === col.dbValue).length}
                            </h2>

                            <div className="space-y-4">
                                {tasks.filter(t => t.durum === col.dbValue).map(task => {
                                    const prev = getPrevStatus(task.durum);
                                    const next = getNextStatus(task.durum);

                                    return (
                                        <div
                                            key={task.id}
                                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[9px] px-2 py-1 rounded-lg font-black uppercase ${
                                                    task.oncelik === 'yuksek' ? 'bg-red-50 text-red-500' :
                                                    task.oncelik === 'orta' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                    {task.oncelik}
                                                </span>

                                                {/* ✅ Durum taşıma butonları */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={!prev}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (prev) handleStatusChange(task.id, prev);
                                                        }}
                                                        className={`text-xs font-black px-2 py-1 rounded-lg border transition-all ${
                                                            prev
                                                                ? 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                                                                : 'border-slate-100 text-slate-200 cursor-not-allowed'
                                                        }`}
                                                        title="Bir önceki sütuna taşı"
                                                    >
                                                        ←
                                                    </button>

                                                    <button
                                                        disabled={!next}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (next) handleStatusChange(task.id, next);
                                                        }}
                                                        className={`text-xs font-black px-2 py-1 rounded-lg border transition-all ${
                                                            next
                                                                ? 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                                                                : 'border-slate-100 text-slate-200 cursor-not-allowed'
                                                        }`}
                                                        title="Bir sonraki sütuna taşı"
                                                    >
                                                        →
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                                                {task.baslik}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-2 line-clamp-3 font-medium">
                                                {task.icerik}
                                            </p>

                                            {task.son_tarih && (
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                        📅 {task.son_tarih}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {tasks.filter(t => t.durum === col.dbValue).length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl">
                                        <p className="text-[10px] font-bold text-slate-300 uppercase">Görev Yok</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Tasks;
