import React,{useState, useEffect, useRef} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import { ReactComponent as BellIcon} from './icons/bell.svg';
import { ReactComponent as MessengerIcon} from './icons/messenger.svg';
import { ReactComponent as CaretIcon} from './icons/caret.svg';
import { ReactComponent as PlusIcon} from './icons/plus.svg';
import { ReactComponent as CogIcon} from './icons/cog.svg';
import { ReactComponent as ChevronIcon} from './icons/chevron.svg';
import { ReactComponent as ArrowIcon} from './icons/arrow.svg';
import { ReactComponent as BoltIcon} from './icons/bolt.svg';
import {CSSTransition} from 'react-transition-group';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '60%',
    maxWidth:300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts]= useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn,setOpenSignIn]=useState(false);

  useEffect(() => {
    // listener for any authentication change happens
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
        if(authUser){
          //if user logged in
          console.log(authUser);
          setUser(authUser);
        } else{
          //if user logged out
          setUser(null);
        }
    })
    return () =>{
      //clean up
      unsubscribe();
    }

  }, [user,username]);


  useEffect( ()  => {
      db.collection('posts')
      .orderBy('commentBump',"desc").limit(5)
      .onSnapshot((snapshot) =>{
        setPosts(
          snapshot.docs.map(doc =>({
          id:doc.id,
          post:doc.data()
        })))
      })
      //everytime new post added it will do this code
  },[] );

  

const signUp= (event) => {
  event.preventDefault();

  auth
  .createUserWithEmailAndPassword(email,password)
  .then((authUser) => {
    return authUser.user.updateProfile({
      displayName: username
    })
  })
  .catch((error) => alert(error.message));
}

const signIn = (event) => {
  event.preventDefault();
  auth
  .signInWithEmailAndPassword(email,password)
  .catch((error) => alert(error.message))
  setOpenSignIn(false);
}



  return (

    <div className="App">
      

      <Modal
          open={open}
          onClose={() =>setOpen(false)}
      >
          <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app__headerImage"
                src="https://i.imgur.com/gZGBslk.png"
                alt=""
                />
            </center>
            <Input
              placeholder="username"
              type="text"
              maxLength={5}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />


            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>

          </div>
        </Modal>

        <Modal
            open={openSignIn}
            onClose={() =>setOpenSignIn(false)}
        >
            <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://i.imgur.com/gZGBslk.png"
                  alt=""
                  />
              </center>
            <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />


              <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>

            </div>
          </Modal>
      {/* Header class*/}

      
      <div className="app__header">
      <Navbar>

      {user ? ( 
        <div className="app_loggedInNav">
          <h3 className="app_user">{user.displayName}</h3>
          <view>
          <NavItem className="app_navIcon" icon={<CaretIcon/>} >
               <DropdownMenu/>
             </NavItem>
        </view>
        </div>
          
          ): (
            <div className="app_loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>

            </div>
          )}
             
             {/* <NavItem icon={<PlusIcon/>}/>
             <NavItem icon={<BellIcon />}/>
             <NavItem icon={<MessengerIcon/>}/> */}  
       </Navbar>
        {/* <img
          className="app__headerImage"
          src="https://i.imgur.com/gZGBslk.png"
          alt=""
          /> */}

          {/* {user ? (<Button onClick={()=>auth.signOut()}>Logout</Button> ) 
          
          : (
            <div className="app_loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>

            </div>
          )} */}
          </div>
            

           {/* <Navbar>
             
            <NavItem icon={<PlusIcon/>}/>
            <NavItem icon={<BellIcon />}/>
            <NavItem icon={<MessengerIcon/>}/>
            <NavItem icon={<CaretIcon/>}>
              <DropdownMenu/>
            </NavItem>
      </Navbar> */}
      
      
      <div className="app_postRow">
        <div className="app_posts">
        {
          posts.map(({id,post}) => (
            
             <Post key={id} postId={id} user={user} postnum={post.postnum} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }

        </div>
      </div>
      {/*user? is optional so if user is not there it wont break */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
          <h3> You need to log in to upload </h3>
      )} 
      {/* posts */}
    </div>
  );
}


function Navbar(props){
  
  return (
    <nav className="navbar">

      <ul className="navbar-nav"> {props.children }</ul>

      </nav>

  );
}

function NavItem(props){

  const [open,setOpen]= useState(false);
  return(
    <li className="nav-item">
      {/* setting toggle for navbar default close */}
      <a href="javascript:void();" className="icon-button" 
      onClick={()=>setOpen(!open)}>
        {props.icon}
      </a>
      {open && props.children}
    </li>
  );
}

function DropdownMenu(){

  const [activeMenu,setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);

  function calcHeight(el){
    const height = el.offsetHeight;
    setMenuHeight(height);
  }


  function DropdownItem(props)
  {
    return (
      <a href="javascript:void();" className="menu-item"  onClick={()=> props.goToMenu&& setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon} </span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }
  return (
  <div className="dropdown" style={{height:menuHeight}}>
    <CSSTransition 
    in={activeMenu==='main'} 
    unmountOnExit 
    timeout={500}
    classNames="menu-primary"
    onEnter={calcHeight}
    >
      <div className="menu">
      <DropdownItem> My Profile</DropdownItem>
      <DropdownItem 
      leftIcon={<CogIcon/>} 
      rightIcon={<ChevronIcon/>}
      goToMenu="settings">
        Settings
      </DropdownItem>
      <div className="signOutButton">
      <Button style={{textTransform: 'none' }} onClick={()=>auth.signOut()}>
        <div className="signOutText">
          
        Sign Out
        </div>
        </Button>
    </div>
      </div>
    </CSSTransition>

    <CSSTransition 
    in={activeMenu==='settings'} 
    unmountOnExit 
    timeout={500}
    classNames="menu-secondary"
    onEnter={calcHeight}
    >
      <div className="menu">
      <DropdownItem leftIcon={<ArrowIcon/>} goToMenu="main"/>
      <DropdownItem> Dark Mode</DropdownItem>
     

      </div>
    </CSSTransition>
  </div>
  );
}

export default App;
