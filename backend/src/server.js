import fs from 'fs'
import admin from 'firebase-admin'
import express from 'express';
import {db,connectToDB} from  './db.js'

const credentials = JSON.parse(
    fs.readFileSync("./credentials.json")
);

admin.initializeApp({
    credential:admin.credential.cert(credentials)
});


const app = express();
app.use(express.json());

//we add an express midddleware to load the user information, this middleware applies only the next component
app.use(async (req,res, next) =>{
    const { authtoken } = req.headers;
    console.log(`[middleware 1] [url]:${req.path} [authtoken]:${authtoken}`);

    if(authtoken){
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);       
        } catch (e) {
            console.log("[middleware] Error verificando el token:",e.message);
            //we use return  to avoid [ERR_HTTP_HEADERS_SENT] error
            return res.sendStatus(400);
        }
    }

    req.user = req.user || {};
    console.log("[middleware 1] [req.user]:",req.user);

    next();
})


//EndPoints
app.get('/api/articles/:name', async (req,res)=>{
    const { name } = req.params;
    const { uid } = req.user;

    console.log("[get] [name]:",name);
    console.log("[get] [uid]:",uid);
    const article = await db.collection('articles').findOne({name});
    console.log("[get] [article]:",article);

    if(article){
        const upvoteIds = article.upvoteIds || [];
        console.log("[get] [upvoteIds]:",upvoteIds);
        //Indica si pueden votar o no
        article.canUpvote = uid && !upvoteIds.includes(uid);
        console.log("[get] [articleUpdated]:",article);
        res.json(article);
    }else{
        res.sendStatus(404)
    }

})

//Prevent to make  unautorized requests
app.use((req, res, next) =>{
    console.log("[middleware 2] Entrando");

    if(req.user){
        next();
    }else{
        res.sendStatus(401);
    }
});

app.put('/api/articles/:name/upvotes',async (req,res)=>{
    const {name} = req.params;
    const {uid} = req.user;

    const article = await db.collection('articles').findOne({name});

    console.log("[Upvotes] name:",name);
    console.log("[Upvotes] uid:",uid);
    console.log("[Upvotes] article:",article);

    if(article){
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if(canUpvote){
            await db.collection('articles').updateOne({name}, {
                    $inc:{ upvotes:1 },
                    $push:{ upvoteIds:uid }
            });
        }
   
        const updatedArticle = await db.collection('articles').findOne({name});
        res.json(updatedArticle)

    }else{
        res.send('That article doesn\'t exist');
    }
})

app.post('/api/articles/:name/comments',async (req,res)=>{
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;

    console.log("[Comments] name:",name);
    console.log("[Comments] text:",text);
    console.log("[Comments] email:",email);

    await db.collection('articles').updateOne({name},{
        $push:{ comments: { postedBy: email, text } },
    })

    const article = await db.collection('articles').findOne({name});

    if(article){
        res.json(article);
    }else{
        res.send('That article doesn\'t exist');
    }

})

connectToDB(() => {
    console.log("Succesfully connected to database!")
    app.listen(8000,()=>{
        console.log('Server is listening on port 8000')
    })
})