import React from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";

function Post({username, caption,imageUrl}) {
  return (
    <div className = "post">
      <div className= "post_header">
        <Avatar
            className="post_avatar"
            alt='Frankie'
            src="/static/images/avatar/1.jpg"
        />
          <h3> {username} </h3>
      </div>

  {/* header & avatar & username*/}
    {/*images*/}

    <img className="post_image" src={imageUrl} alt=""/>
    {/*username & caption*/}
    <h4 className="post_text"> {username} <strong>{caption}</strong></h4>
    </div>

  )

}


export default Post
