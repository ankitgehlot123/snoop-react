import React,{useState,useRef,useEffect} from 'react'
import './sidebar.css'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import {Avatar, IconButton} from '@material-ui/core'
import LinkIcon from '@material-ui/icons/Link';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Scrollbars } from 'react-custom-scrollbars';

function Sidebar(props) { 
    const scrollRef = useRef()
    const inputRef = useRef()
    const [input,setInput] = useState("")
    const history = useHistory()
    const sendMessage = ()=>{
        if(input.length)
        { 
            props.sendMessage(input)
            setInput('')
            inputRef.current.focus();
        }
    }
    useEffect(() => {
        scrollRef.current.scrollTop(scrollRef.current.getScrollHeight())
    }, [props.messages])
    return (
        <Grid
        item
        container
        xs={12} sm={5} md={3}
        direction="column"
        alignItems="stretch"
        alignContent="stretch"
        style={{height:'100vh'}}
        >
            <div className='chat'>
            <div className='chat__header'>
                <div className='chat__header_avatar'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${props.avatar.userId}.svg?mood[]=happy`} style={{marginRight:'20px'}}/>
                <h4 className='avatar__name'>{props.avatar.name}</h4>
                </div>
                <div>
                <Tooltip title="Copy Invite link" aria-label="copy">
                <CopyToClipboard onCopy={props.onCopyInvite} text={props.inviteUrl}>
                <IconButton>
                    <LinkIcon/>
                </IconButton>
                </CopyToClipboard>
                </Tooltip>
                <Tooltip title="Leave Meeting" aria-label="leave">
                <IconButton onClick={()=>{props.leave();history.push('/');}} >
                    <ExitToAppIcon />
                </IconButton>
                </Tooltip>
                </div>
            </div>
           
            <div className='chat__body'>
            <Scrollbars ref={scrollRef} >
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
    </Grid>
    )
}

export default Sidebar;
