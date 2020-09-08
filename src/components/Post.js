import React from "react";
import {ADDRESS_MY_POST, API_LIKE_POST, API_NEW_COMMENT} from "../Properties";

export default function Post({postsList, setPostsList, getNews}) {

    function slide(action, postIndex) {
        let newState = [...postsList];
        let newPostPhotosOrder = [];

        for (let i = 0; i < newState[postIndex].photos.length; i++) {
            switch (action) {
                case "next":
                    if (i === newState[postIndex].photos.length - 1) {
                        newPostPhotosOrder[i] = newState[postIndex].photos[0];
                        continue;
                    }
                    newPostPhotosOrder[i] = newState[postIndex].photos[i + 1]
                    break;
                case "back":
                    if (i === 0) {
                        newPostPhotosOrder[i] = newState[postIndex].photos[newState[postIndex].photos.length - 1];
                        continue;
                    }
                    newPostPhotosOrder[i] = newState[postIndex].photos[i - 1]
                    break;
            }
        }

        newState[postIndex].photos = newPostPhotosOrder;
        setPostsList(newState);
    }

    function sendNewComment(form, postId) {
        let text = "";
        for (const element of form) {
           if(element.id === "text") { text = element.value }
        }

        fetch(API_NEW_COMMENT, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({text, postId})
        }).then(r => r.json()).then(r => {
            if(!r.err) { getNews() }
        })
    }

    function likePost(postId) {
        fetch(API_LIKE_POST, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({postId})
        }).then(r => r.json()).then(r => {
            if(!r.err) { getNews() }
        })
    }

     return (
         <>
             {postsList.map(({postData, comments, photos, isLiked}, postIndex) =>
                 <div key={postData.postId} className="post">

                     <div className="top_panel">
                         <div className="author">
                             <img className="avatar" src={`http://localhost:3001/getImage?type=avatar&id=${postData.avatar}`}/>
                             <div>{postData.name} {postData.lastName}</div>
                             <div>{postData.date}</div>
                         </div>

                         {window.location.pathname === ADDRESS_MY_POST ?
                             <>
                                 <div className="edit_button">Редактировать</div>
                                 <div className="delete_button">Удалить</div>
                             </> : ""
                         }


                         <div className={`likes_button ${isLiked ? "active_likes" : ""}`} onClick={() => likePost(postData.postId)}>
                             <img src={ require("../assets/like.png") }/>
                             <div>{postData.likes}</div>
                         </div>
                     </div>

                     <div className="post-text">{postData.text}</div>
                     <div className="slider">
                         <div className="slide-back-btn" onClick={ () => slide("back", postIndex) }/>
                         <div className="slide">
                             {photos.map((photo, index) =>
                                 <img key={index}
                                      src={`http://localhost:3001/getImage?type=postImage&id=${photo.title}`}
                                      className={
                                           index === 0 ? "current_slide" : "other_slide"
                                      }
                                 />
                             )}
                         </div>
                         <div className="slide-next-btn" onClick={ () => slide("next", postIndex) }/>
                     </div>
                     {comments.map(comment =>
                         <div key={comment.id} className="comments">
                             <div className="comment">
                                 <img className="avatar" src={`http://localhost:3001/getImage?type=avatar&id=${comment.avatar}`}/>
                                 <div className="comment-text">
                                     <div><b>{comment.name} {comment.lastName}</b></div>
                                     <div>{comment.text}</div>
                                 </div>
                             </div>
                             <hr />
                         </div>
                     )}


                     <form className="newCommentArea">
                         <textarea id="text" placeholder="Ваш комментарий..."/>
                         <button className="button" onClick={e => {
                             e.preventDefault();
                             sendNewComment(e.target.form.elements, postData.postId);
                         }}>Отправить</button>
                     </form>
                 </div>
             )}
         </>
     );
}



