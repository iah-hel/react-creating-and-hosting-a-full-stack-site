import express from 'express';

const app = express();

//Tells express that the request  has a Json body and it should try to parse
app.use(express.json());

app.get('/hello',(req,res) => {
    res.send("Hello!");
});

app.post('/hello',(req,res) => {
    console.log(req.body)
    res.send(`Hello ${req.body.name}!`);
});


app.listen(8000,()=>{
    console.log('Server is listening on port 8000')
})
