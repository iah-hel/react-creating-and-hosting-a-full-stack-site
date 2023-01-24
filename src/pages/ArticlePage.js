//localhost:3000/articles/learn-code
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import articles from "./article-content";
import CommentsList from "../components/CommentsList";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () =>{
    
    const [ articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
    const { articleId } = useParams();

    useEffect(() => {
        //we have to create a function to avoid errors with async
        const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
    }, [])

    const article = articles.find(article => article.name === articleId);

    if(!article){
        return <NotFoundPage />   
    }

    return (
        <>
            <h1>{article.title}</h1>
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
            {
                article.content.map((paragraph,index)  => (
                    <p key={index}>{paragraph}</p>
                ))
            }
            <CommentsList comments={articleInfo.comments} />
        </>
    )
}

export default ArticlePage;