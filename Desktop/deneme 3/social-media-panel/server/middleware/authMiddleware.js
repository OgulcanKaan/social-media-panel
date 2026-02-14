const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Header'dan token'ı al
    const token = req.header('Authorization');

    // 2. Token yoksa reddet
    if (!token) {
        return res.status(401).json({ message: "Yetkisiz erişim! Token yok." });
    }

    try {
        // 3. Token'ı doğrula (Bearer <token> temizliği)
        const tokenDuzgun = token.replace('Bearer ', '');
        
        const decoded = jwt.verify(tokenDuzgun, process.env.JWT_SECRET);

        // 4. Kullanıcı bilgisini isteğe ekle
        req.user = decoded;
        
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Geçersiz token." });
    }
};