import express, { response } from 'express';

//Fake database
let articlesInfo= [{
    name:'learn-react',
    upvotes:0,
    comments:[],
},{
    name:'learn-node',
    upvotes:0,
    comments:[],
},{
    name:'mongodb',
    upvotes:0,
    comments:[],
}]

const app = express();
app.use(express.json());

//EndPoints

app.put('/api/articles/:name/upvotes',(req,res)=>{
    const {name} = req.params;
    const article = articlesInfo.find(article=> article.name === name);
    
    if(article){
        article.upvotes += 1;
        res.send(`The  ${name} article now has ${article.upvotes} upvotes!!`);
    }else{
        res.send('That article doesn\'t exist');
    }
})

app.post('/api/articles/:name/comments',(req,res)=>{
    const {name} = req.params;
    const {postedBy,text} = req.body;

    const article = articlesInfo.find(article=> article.name === name);

    if(article){
        article.comments.push({postedBy,text});
        res.send(article.comments);
    }else{
        res.send('That article doesn\'t exist');
    }

})



app.listen(8000,()=>{
    console.log('Server is listening on port 8000')
})
