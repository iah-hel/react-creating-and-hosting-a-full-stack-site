//localhost:3000/articles/learn-code
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () =>{
    const [ articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });

    useEffect(() => {
        setArticleInfo({upvotes:3,comments:[]});
    })

    const { articleId } = useParams();
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
        </>
    )
}

export default ArticlePage;