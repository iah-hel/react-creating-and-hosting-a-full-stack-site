import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import useUser from '../hooks/useUser';
import articles from './article-content';
import { Navigate } from 'react-router-dom';


const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false });
    const { canUpvote } = articleInfo;
    const { articleId } = useParams();
    const navigate = useNavigate();

    const { user, isLoading } = useUser();

    useEffect(() => {
        console.log("[Article Page] Useeffect")
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            const response = await axios.get(`/api/articles/${articleId}`, { headers });
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        if (!isLoading) {
            loadArticleInfo();
        }
    }, [isLoading, user]);

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {

        const token = user && await user.getIdToken();
        console.log("[addUpVote] token",token)
        const headers = token ? { authtoken: token } : {};
        console.log("[addUpVote] headers",headers)
        console.log(`[addUpVote] url:/api/articles/${articleId}/upvote`)
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
        const updatedArticle = response.data;
        console.log("[addUpVote] updatedArticle",updatedArticle)
        setArticleInfo(updatedArticle);
    }

    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            {user
                ? articleInfo.canUpvote?<button onClick={addUpvote}>Upvote!! </button> : <button>Already Upvoted</button>
                : <button onClick={()=>navigate('/login')}>Log in to upvote</button>}
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
        ))}
        {user
            ? <AddCommentForm
                articleName={articleId}
                onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
            : <button onClick={()=>navigate('/login')}>Log in to add a comment</button>}
        <CommentsList comments={articleInfo.comments} />
        </>
    );
}

export default ArticlePage;