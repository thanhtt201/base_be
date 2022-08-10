const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));


const authRoute = require("./routes/auth");

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
