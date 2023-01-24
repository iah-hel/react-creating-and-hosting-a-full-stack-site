import { useState } from "react";
import axios from "axios";

const AddCommentForm = ({articleName,onArticleUpdated}) =>{
    const [name,setName] = useState('');
    const [commentText,setCommentText] = useState('');

    const addComment = async () =>{
       const response = await axios.post(`/api/articles/${articleName}/comments`,{
        postedBy:name,
        text: commentText,
       }); 

       const updatedArticle = response.data;
       onArticleUpdated(updatedArticle);
       setName('');
       setCommentText('');
    }

    return(
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            <label>
                    Name:
                    <input type="text"  value={name} onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                Comment:
                <textarea rows="4" cols="50" value={commentText} onChange={e => setCommentText(e.target.value)}/>
            </label>
            <button onClick={addComment}>Add Comment</button>
        </div>
    )
}

export default  AddCommentForm;