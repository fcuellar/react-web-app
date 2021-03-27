import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db} from './firebase'
function App() {
  const [posts,setPosts]= useState([
    // { username: "burnaboy",
    //   caption: "WoW it Work",
    //   imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bad_Bunny_2019_by_Glenn_Francis.jpg/440px-Bad_Bunny_2019_by_Glenn_Francis.jpg"
    // },
    // { username: "chels",
    //   caption: "WoW it Work",
    //   imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bad_Bunny_2019_by_Glenn_Francis.jpg/440px-Bad_Bunny_2019_by_Glenn_Francis.jpg"
    //
    //
    // }
  ]);
  // USEFFECT runs a piece of code based on a specific condition

  useEffect(() => {
      db.collection('posts').onSnapshot(snapshot =>{
        setPosts(snapshot.docs.map(doc =>({
          id:doc.id,
          post:doc.data()})))
      })
      //everytime new post added it will do this code
  }, []);

  return (
    <div className="App">
      {/* Header class*/}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          />

      </div>
      <h1> HELLO THIS IS   THE TEST 🚀   </h1>
      {
        posts.map(({id,post}) => (
          
           <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }


      {/* posts */}
    </div>



  );
}

export default App;
