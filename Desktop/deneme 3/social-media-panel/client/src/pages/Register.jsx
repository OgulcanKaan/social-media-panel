//Kullanıcı giriş ve kayıt ekranları. JWT tabanlı güvenlik sisteminin başlangıç noktası.

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ ad: '', email: '', sifre: '', rol: 'calisan' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || "Kayıt hatası!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[32px] shadow-xl w-full max-w-md space-y-6 border border-slate-200">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Yeni Hesap</h2>
                    <p className="text-slate-500 text-sm font-medium">Sisteme erişim için kayıt olun</p>
                </div>
                
                <div className="space-y-4">
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Ad Soyad" onChange={e => setFormData({...formData, ad: e.target.value})} required />
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" type="email" placeholder="E-posta Adresi" onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" type="password" placeholder="Şifre" onChange={e => setFormData({...formData, sifre: e.target.value})} required />
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                    Kayıt Ol
                </button>
                
                <p className="text-center text-slate-500 text-sm font-medium">
                    Zaten hesabınız var mı? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer font-bold hover:underline">Giriş Yapın</span>
                </p>
            </form>
        </div>
    );
};

export default Register;