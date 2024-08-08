const express = require('express');
const port = 3002;
const cors = require('cors');
const {blog, sharpadmin} = require("./db");
const {users, createPost} = require("./types");
const multer = require("multer");
const fs = require("fs");
const slugify = require("slugify");
const { format } = require('date-fns');
const path = require("path");
const uploadImage = require('./imgurConfig');

const app = express();

// app.use(cors());

// app.use(cors({
//     origin: 'https://www.sharpmoney.co.in',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "https://www.sharpmoney.co.in"); //use this for prod
    res.header("Access-Control-Allow-Origin", "http://localhost:5173" ) //use this for dev
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/create", upload.single("image"), async function(req,res){
    const createPayload = req.body;
    const image = req.file;
    if (!image) {
        return res.status(400).json({ error: 'Image upload failed' });
    }

    const imageUrl = await uploadImage(image);
    const slug = slugify(createPayload.title);

    switch (true) {
        case !createPayload.title:
            return res.status(400).json({ error: 'Title is required' });
            break;
        case !createPayload.content:
            return res.status(400).json({ error: 'Content is required' });
            break;
    }
    const today = new Date();
    const formatdate = format(today, 'dd-MM-yyyy');

    const tagsArray = createPayload.tags.split(',').map(tag=>tag.trim());

    const post = new blog({
        title: createPayload.title,
        content: createPayload.content,
        user: createPayload.user,
        slug: slug,
        date: formatdate,
        imageUrl: imageUrl,
        tags: tagsArray,
        tagsblogs: createPayload.tags
    });

    await post.save();
    res.send(post)
})


app.get("/", async function(req,res){
    const bloglist = await blog.find({})
    .sort({createdAt:-1});

     // Extract all tags and flatten the array
     const allTags = bloglist.reduce((acc, blog) => {
        if (typeof blog.tags === 'string') {
            acc.push(...blog.tags.split(',').map(tag => tag.trim()));
        } else {
            acc.push(...blog.tags);
        }
        return acc;
    }, []);

    // Get unique tags
    const uniqueTags = [...new Set(allTags)];

    res.json({
        list: bloglist,
        tags: uniqueTags
    });

    console.log(uniqueTags);
    // const taglist = bloglist.map(item => item.tags);
    // console.log(taglist);
    // const exhaustivetags = [];
    // const emptyarray =[];
    // const newarr = bloglist.map(item => {
    //     const newarr2 = item.tags.split(',');
    //     console.log(newarr2);
    //     exhaustivetags.push(item.tags);
    // })
    // console.log(exhaustivetags);
})


app.get("/blog/:slug", async function(req,res){
    const {slug} = req.params;
    const read = await blog.findOne({slug});
    // const post = await blog.findById(req.params.id);
    // res.send(post);
    res.send(read);
})

app.put("/deletepost", async function(req,res){
    const createPayload = req.body;
    console.log(createPayload._id);
    await blog.deleteOne({
        _id: createPayload._id
    });

    res.send("Blog deleted");
})

app.post("/adminlogin", async function(req,res){
    const createPayload = req.body;
    const filter = {
        username: createPayload.username
    }

    const userInfo = await sharpadmin.findOne(filter);
    console.log(userInfo.username);

    if(userInfo!=null){
        if(userInfo.username==createPayload.username && userInfo.password==createPayload.password){
            res.json({
                msg: "login successfull by " + userInfo.username,
                success: true
            });

        }
        else{
            res.status(400).json({
                msg: "Invalid creds",
                success: false
            });
        }
    }
    else{
        res.status(400).json({
            msg: "Invalid username",
            success: false
        });
    }
})

app.post("/signup", async function(req,res){
    const createPayload = req.body;
    const response = new sharpadmin({
        username: createPayload.username,
        password: createPayload.password
    });

    await response.save();
    res.send(response);  
})


app.listen(port);