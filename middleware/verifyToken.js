const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
        return res.status(403).json({
            error: "Không có quyền truy cập"
        })
    }
    try {
        const decoded = jwt.verify(token, 'thanh2k1_access')
        req.user = decoded
    } catch (error) {
        return res.status(401).send("Token hết hạn")
    }
    return next()
}

module.exports = verifyToken