import fs from 'fs'
import admin from 'firebase-admin'
import express, { response } from 'express';
import { MongoClient } from 'mongodb';
import {db,connectToDB} from  './db.js'
import path from 'path';

const credentials = JSON.parse(
    fs.readFileSync(process.cwd() +"/credentials.json")
);

admin.initializeApp({
    credential:admin.credential.cert(credentials)
});


const app = express();
app.use(express.json());

//we add an express midddleware to load the user information, this middleware applies only the next component

app.use(async (req,res, next) =>{
    const { authtoken } = req.headers;
    console.log("[middleware 1] authtoken:",authtoken);

    if(authtoken){
        try {
            const user = await admin.auth().verifyIdToken(authtoken);
            console.log("[middleware] user:",user);
            req.user = user;
            
        } catch (e) {
            res.sendStatus(400);
        }
    }

    next();
})


//EndPoints
app.get('/api/articles/:name', async (req,res)=>{
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({name});

    if(article){
        const upvoteIds = article.upvoteIds || [];
        //Indica si pueden votar o no
        article.canUpvote = uid && !upvoteIds.include(uid);
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

    if(article){
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.include(uid);

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



    await db.collection('articles').updateOne({name},{
        $push:{comments : { postedBy : email,text}}
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