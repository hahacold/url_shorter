// 引入套件
const express = require("express");
const mongoose = require('mongoose');


const router = express.Router();

// 連接到 MongoDB 資料庫
//const uri = "mongodb+srv://admin:hahasocold@cluster0.yzyu61x.mongodb.net/?retryWrites=true&w=majority";
//mongoose.connect('mongodb://localhost:27017/urldb');
mongoose.connect("mongodb+srv://admin:hahasocold@cluster0.yzyu61x.mongodb.net/?retryWrites=true&w=majority")
// mongoose.connect('mongodb+srv://admin:admin6631@cluster0.em8n9ep.mongodb.net/?retryWrites=true&w=majority'); // 連結雲端Atlas
//mongoose.connect(uri);
const db = mongoose.connection;

// 與資料庫連線發生錯誤時
db.on('error', console.error.bind(console, 'Connection fails!'));

// 與資料庫連線成功連線時
db.once('open', function () {
    console.log('Connected to database...');
});

// 該collection的格式設定

const urlSchema = new mongoose.Schema({
    url: { //事項名稱
        type: String, //設定該欄位的格式
        required: true //設定該欄位是否必填
    },
    shorturl: { //是否已完成
        type: String,
        required: true,
    },
    countdown: { //新增的時間
        type: Number,
        required: true
    }
})

const Url = mongoose.model('Url', urlSchema);

// 取得全部資料
// 使用非同步，才能夠等待資料庫回應
router.get("/", async (req, res) => {
    // 使用try catch方便Debug的報錯訊息
    try {
        // 找出Todo資料資料表中的全部資料
        const url = await Url.find();
        // 將回傳的資訊轉成Json格式後回傳
        //res.json(url);
    } catch (err) {
        // 如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
        return;
    }
});

// 新增待辦事項
// 將Method改為Posft
router.post("/", async (req, res) => {
    // 從req.body中取出資料

    //進行檢查
    try {
        originalUrl = new URL(req.body.url);
    } catch (err) {
        res.redirect("/urlinvaild.html");
        //return res.status(400).send({ error: 'invalid URL' });
    }
    //檢查是否為Url結構
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
    if (req.body.shorturl == null) {
        req.body.shorturl = generateString(5)
    }
    const url = new Url({
        url: req.body.url,
        shorturl: req.body.shorturl,
        countdown: req.body.countdown
    });
    try {
        // 找出Todo資料資料表中的全部資料
        const url = await Url.find();
        
    } catch (err) {
        // 如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
        return;
    }
    
    try {
        // 使用.save()將資料存進資料庫
        const newUrl = await url.save();
        res.redirect("success.html")
        //res.redirect("https://ill-teal-eel-fez.cyclic.app/success.html");
        // 回傳status:201代表新增成功 並回傳新增的資料
        //res.redirect("urlinvaild.html");
        //res.status(201).json(newUrl);
        return
    } catch (err) {
        // 錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.redirect("urlinvaild.html");
        //res.status(400).json({ message: err.message })
        return
    }


});

// 在網址中傳入id用以查詢
router.get("/:shorturl", async (req, res) => {
    try {
        const url = await Url.findOne({shorturl: req.params.shorturl});
        if (url == undefined) {
            res.redirect("urlnotfound.html");
            
            //return res.status(404).json({ message: "Can't find url" })
        } else {
            res.redirect(url.url);
            url.countdown -= 1;
            
            //return res.status(200).json(student);
        }
        if (url.countdown <= 0) {
            await Url.findOneAndDelete({shorturl: req.params.shorturl})
            //Url.findByIdAndDelete(req.params.id);

        } else {
            
            url.save();
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


// // 更新代辦事項
// router.put("/:id", async (req, res) => {
//     try {
//         // 將取出的代辦事項更新
//         const newStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(newStudent);
//     } catch (err) {
//         // 資料庫操作錯誤將回傳500及錯誤訊息
//         res.status(500).json({ message: "update student failed!" });
//     }
// });

// // 刪除代辦事項
// router.delete("/:id", async (req, res) => {
//     try {
//         // 將取出的代辦事項刪除      
//         await Student.findByIdAndDelete(req.params.id);
//         // 回傳訊息
//         res.json({ message: "Delete student successfully!" });
//     } catch (err) {
//         // 資料庫操作錯誤將回傳500及錯誤訊息
//         console.log(err);
//         res.status(500).json({ message: "remove student failed!" });
//     }
// });

// Export 該Router
module.exports = router;