#  Social Media Agency CRM & Content Panel

Sosyal medya ajansları için geliştirilmiş **Full-Stack CRM + İçerik Yönetim Paneli**.  
Müşteri takibi, sosyal medya hesap yönetimi ve içerik planlamayı tek bir sistemde toplar.

---

## Özellikler

-  Dashboard & istatistikler
-  Müşteri ekleme / düzenleme / silme
-  İçerik takvimi (Instagram, LinkedIn, TikTok vb.)
-  Platform bazlı renkli rozetler
-  JWT tabanlı güvenli giriş sistemi

---

## Teknolojiler

**Frontend:** React, Vite, Tailwind, Axios  
**Backend:** Node.js, Express, PostgreSQL, Sequelize  
**Auth:** JWT, Bcrypt  

---

## Mimari
├── client/          # React (Frontend)
├── server/          # Node.js & Express (Backend)
└── README.md        # Proje Dokümantasyonu

## Kurulum

### Backend
cd server
npm install
# .env dosyanızı oluşturun ve DB bilgilerinizi girin
npm run dev

### frontend
cd client
npm install
npm run dev

Frontend: http://localhost:5173

Backend: http://localhost:5000