//Kullanıcı giriş ve kayıt ekranları. JWT tabanlı güvenlik sisteminin başlangıç noktası.
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { 
                email, 
                sifre 
            });
            
            // Token'ı tarayıcıya kaydet
            localStorage.setItem('token', res.data.token);
            
            // Başarılı girişten sonra Dashboard'a yönlendir
            navigate('/dashboard');
            
        } catch (error) {
            const mesaj = error.response?.data?.message || "Sunucuya bağlanılamadı!";
            alert("Giriş Hatası: " + mesaj);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800">Yönetim Paneli</h2>
                    <p className="text-gray-500 mt-2">Lütfen hesabınıza giriş yapın</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            E-posta Adresi
                        </label>
                        <input 
                            type="email" 
                            placeholder="ornek@mail.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Şifre
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={sifre}
                            onChange={(e) => setSifre(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all duration-200"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;