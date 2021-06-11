import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import {db} from './firebase';
import firebase from 'firebase';

function Post({postId,username,user, caption,imageUrl,postnum}) {
  
  const [comments, setComments] =useState([]);
  const [comment,setComment] = useState("");
  useEffect(() => {
  
    let unsubscribe;
      if(postId){
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp')
        .onSnapshot((snapshot) =>{
          setComments(snapshot.docs.map((doc)=>doc.data()));
        });
      }
      return() =>{
        unsubscribe();
      };
  }, [postId]);

const postComment = (event) => {
  event.preventDefault();
  db.collection("posts").doc(postId).collection("comments").add({
    text: comment,
    username:user.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  setComment('');
  // Updates the comment timestamp so we can bump the post to the top
  db.collection("posts").doc(postId).update({
    "commentBump": firebase.firestore.FieldValue.serverTimestamp(),
   
  });
  
 
}

  return (
    <div className = "post">
      <div className= "post_header">
        <Avatar
            className="post_avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"/>
          <h3> {username}</h3>
          <div className = "post_num"> <strong>#{postnum}</strong> </div>

      </div>
  {/* header & avatar & username*/}
    {/*images*/}
    <img className="post_image" src={imageUrl} alt=""/>
    {/*username & caption*/}
    <h4 className="post_text"> <strong>{username}: {caption}</strong></h4>
    {/*comment form */}

    <div className="post_comments">
      {comments.map((comment)=>(
        <p>
            <strong> {comment.username}: </strong>{comment.text}
        </p>
      ))}

    </div>
    {/* user&& wont show this unless there is a user logged in */}
    {user&& (
      <form className="post_commentBox">
          <input className="post_input" type="text" placeholder="Post a Comment..." value={comment}onChange={(e) => setComment(e.target.value)} maxLength={'100'} />


          <button
          className="post_button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
          >
          Post
          </button>
      </form>

    )}

  </div>

  )

}


export default Post
