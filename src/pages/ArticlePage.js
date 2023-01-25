//localhost:3000/articles/learn-code
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import NotFoundPage from "./NotFoundPage";
import useUser from "../hooks/useUser";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import articles from "./article-content";


const ArticlePage = () =>{
    
    const [ articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
    const { articleId } = useParams();
    const {user,isLoading} = useUser();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ?  { authtoken: token } : {};// to avoid send authtoken equals to null
            const response = await axios.get(`/api/articles/${articleId}`,headers);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
    }, [])

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () =>{
        const token = user && await user.getIdToken();
        const headers = token ?  { authtoken: token } : {};// to avoid send authtoken equals to null
        const response = await axios.put(`/api/articles/${articleId}/upvotes`,null, headers)
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if(!article){
        return <NotFoundPage />   
    }

    return (
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
                {user
                    ? <button onClick={addUpvote}>Upvote</button>
                    : <button>Log in to Upvote</button>
                }
               
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>

            {
                article.content.map((paragraph,index)  => (
                    <p key={index}>{paragraph}</p>
                ))
            }
            {user
                ?<AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
                :<button>Log in to add a comment</button>
            }

            <CommentsList comments={articleInfo.comments} />
        </>
    )
}

export default ArticlePage;