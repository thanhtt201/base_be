const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");

app.use(express.json());
app.use(cookieParser());

mongoose
	.connect("mongodb://localhost:27017/myapp")
	.then((res) => {
		console.log("Connected");
	})
	.catch((err) => {
		console.log("err", err);
	});

app.use("/api", authRoute);

const PORT = 3001 || 5000;
app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
