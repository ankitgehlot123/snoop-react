import React,{useState,useRef,useEffect} from 'react'
import './sidebar.css'
import {Avatar, IconButton} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import { Scrollbars } from 'react-custom-scrollbars';
import SwipeableDrawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';

function Sidebar(props) { 
    const scrollRef = useRef()
    const inputRef = useRef()
    const [input,setInput] = useState("")
    const [openDraw, setOpenDraw] = React.useState(true);

    const sendMessage = ()=>{
        if(input.length)
        { 
            props.sendMessage(input)
            setInput('')
            inputRef.current.focus();
        }
    }
    
    // useEffect(() => {
    //     scrollRef.current.scrollTop(scrollRef.current.getScrollHeight())
    // }, [props.messages])
    
    useEffect(()=>{
        setOpenDraw(props.openSidebar);
    },[props.openSidebar])

    const setOpenDrawParent=(open)=>{
        props.setOpenDraw(open);
    }

    const toggleDrawer = (open) => (event) => {
        
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setOpenDraw(open);
        setOpenDrawParent(open);
      };
    return (
        <SwipeableDrawer 
        disableSwipeToOpen={typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)}
        anchor='right'  
        open={openDraw} 
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}>
            <div className='chat'>
            <div className='chat__header'>
                <div className='chat__header_avatar'>

                <Avatar src={`https://avatars.dicebear.com/api/human/${props.avatar.userId}.svg?mood[]=happy`} style={{marginRight:'20px'}}/>
                <h4 className='avatar__name'>{props.avatar.name}</h4>
                </div>
                <div>
                    <IconButton onClick={()=>{setOpenDraw(false);setOpenDrawParent(false);}} >
                        <CloseIcon/>
                    </IconButton>
                </div>
            </div>
           
            <div className='chat__body'>
            <Scrollbars ref={scrollRef}>
                {props.messages.map((message,index)=>(
                    <p key={index}  className={`${(!message.sender) ? "chat__message":"chat__receiver"}`}>
                        <span className='chat__name avatar__name'>{message.name}</span>
                        {message.msg}<br/>
                        <span className='chat__timestamp'>{message.dt}</span>
                    </p>
                    
                ))
                }
            </Scrollbars>
            </div>
            
        <div className='chat__footer'>
            <input
                ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <IconButton
                onClick={sendMessage}
                type='submit'>
                    <SendIcon/>
                </IconButton>
        </div>
        </div>
        </SwipeableDrawer>     
    )
}

export default Sidebar;
