import React, {useState, useEffect} from 'react'
import {Button} from "@material-ui/core";
import {db, storage} from './firebase'
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const [postNum,setPostNum] = useState(0);
  // const [togglePostNum,setTogglePostNum]=useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]){
      setImage(e.target.files[0]);
    }
  };

  // db.collection("posts").orderBy('timestamp','desc').limit(1).onSnapshot().then(snap =>
    
  //   {
  //     setPostNum(snap.doc.postnum);
  //   });
  
  useEffect(() => {  
   
  db.collection("posts").orderBy('timestamp','desc').limit(1)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        var postnumber=doc.get("postnum")
        setPostNum(parseInt(postnumber));
        // setTogglePostNum(true)
        
      });
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
   });

  
  },);


  

  const handleUpload = () =>
  {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on("state_changed",(snapshot)=>{const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100  );
      setProgress(progress);},
      (error)=>{console.log(error);alert(error.message);},
      () => 
      {
        //complete upload
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url=> {
            //post image in database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
              postnum: postNum+1,
              commentBump:firebase.firestore.FieldValue.serverTimestamp()

            });
            setProgress(0);
            setCaption("");
            setImage(null);
            // setTogglePostNum(false);
          });
      }
    );
  };

  return (
  <div className="imageUploadBack">
    <div className="imageupload">

      {/* Caption Input / File pick up / Post Button */}
      <progress className= "imageupload_progress" value={progress} max ="100"
      />
      <input type="text" placeholder="Enter a caption.." onChange={event => setCaption(event.target.value)} value={caption} maxLength={'250'} />
      <input type="file" onChange={handleChange} />
      <Button className="file_button" onClick={handleUpload} >
        <h4> Upload </h4>
      </Button>

    </div>
    </div>
  )
}

export default ImageUpload

