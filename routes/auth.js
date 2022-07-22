const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", (req, res) => {
	const { email, password } = req.body;
	const newUser = new User({
		email,
		password,
	});
	newUser.save((err, result) => {
		if (err) {
			return res.status(401).json({
				error: "Đăng kí không thành công",
			});
		}
		res.status(200).json({
			message: "Đăng kí thành công",
		});
	});
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const emailFound = await User.findOne({ email });
	if (!emailFound) {
		return res.status(401).json({
			error: "Email không tồn tại",
		});
	}
	const accessToken = jwt.sign({ email }, "thanh2k1_access", {
		expiresIn: "60s",
	});
	const refreshToken = jwt.sign({ email }, "thanh2k1_refresh", {
		expiresIn: "10h",
	});
	res.cookie("refresh-token", refreshToken);
	res.status(200).json({
		data: {
			user: emailFound,
			accessToken,
			refreshToken,
		},
		message: "Đăng nhập thành công",
	});
});

router.post("/refresh-token", async (req, res) => {
	const getRefreshTokenCookie = req.cookies["refresh-token"];
	if (!getRefreshTokenCookie) {
		return res.status(401).send("Không tìm thấy token");
	}
    try {
        const decodedRefreshToken = jwt.verify(
            getRefreshTokenCookie,
            "thanh2k1_refresh"
        );
        const { email } = decodedRefreshToken
        const emailFound = await User.findOne({ email })
        if (!emailFound) {
            return res.status(401).send("Không tìm thấy user nào")
        }
        const accessToken = jwt.sign({ email }, "thanh2k1_access", {
            expiresIn: "60s",
        });
        const refreshToken = jwt.sign({ email }, "thanh2k1_refresh", {
            expiresIn: "10h",
        });
        res.cookie("refresh-token", refreshToken);
        res.status(200).json({
            data: {
                user: emailFound,
                accessToken,
                refreshToken,
            },
            message: "Cấp quyền truy cập mới thành công",
        });
    } catch (error) {
        return res.status(401).send("Refresh Token bị hết hạn")
    }
	
});

router.get("/users", verifyToken, (req, res) => {
	res.send("Hello");
});

module.exports = router;
