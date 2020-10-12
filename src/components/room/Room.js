import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";
import Peer from "simple-peer";
import { connect } from "react-redux";
import * as actions from "../../store/actions"
import Sidebar from '../sidebar/Sidebar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid'
import AlertDialog from "../dialog/AlertDialogDisplayName"
import Snackbar from '@material-ui/core/Snackbar';
import MicIcon from '@material-ui/icons/Mic';
import IconButton from '@material-ui/core/IconButton';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import CustomVideo from '../video/CustomVideo'
import Menu from '../menu/Menu'
import Tooltip from '@material-ui/core/Tooltip'
import ForumIcon from '@material-ui/icons/Forum';

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const childRef = useRef();
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);

    const [peers, setPeers] = useState([]);
    const [openSidebar, setOpenSidebar] = useState(false)
    const [snackMsg, setSnackMsg] = useState([]);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [micToggleBtn, setMicToggleBtn] = useState(<MicIcon/>);
    const [videoToggleBtn, setVideoToggleBtn] = useState(<VideocamIcon/>);

    const [messages,setMessages] = useState([])
    const roomID = props.match.params.roomID;
    const  create = async (name)=>{
        const userId = uuid();
        
        if(name.length < 1)
            name= userId+"User"   
        props.join(userId,roomID,name);
        socketRef.current = io.connect(process.env.REACT_APP_BACKEND_HOST,{secure: true});
        // navigator.mediaDevices.getDisplayMedia({ cursor: true})
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: {
            "autoGainControl": true,
            "echoCancellation": true,
            "noiseSuppression": true,
          }}).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID,name);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.id, socketRef.current.id, stream,name);
                    peersRef.current.push({
                        data:{
                            peerID:user.id,
                            name:user.name
                        },
                        peer,
                    })
                    peers.push({peer,data:{peerID:user.id,name:user.name}});
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const item = peersRef.current.find(p => p.data.peerID === payload.callerID)
                if(!item) {
                    const peer = addPeer(payload.signal, payload.callerID, stream,name);
                    peersRef.current.push({
                        data:{
                            peerID:payload.callerID,
                            name:payload.name
                        },
                        peer,
                    })

                    setPeers(peersRef.current);
                    handleSnackClick(payload.name+" has joined.");
                    
                }
            });
            
            socketRef.current.on('user left', socketId => {
                const item =  peersRef.current.find(p => p.data.peerID === socketId);
                handleSnackClick(item.data.name+" has left.");
                if(item) {
                    item.peer.destroy() 
                }
                const activePeers = peersRef.current.filter(p => p.data.peerID !== socketId)
                peersRef.current = activePeers;
                setPeers(activePeers)
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.data.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
            socketRef.current.on("createMessage", payload => {
                setMessages((messages)=>[...messages,{name:payload.name,msg:payload.msg,dt:payload.dt,sender:payload.sender}])
            })
            socketRef.current.on('error', function (err) {
                console.log(err);
            });
        })
        
    }
    useEffect(() => {
        childRef.current.handleClickOpen()
    }, []);
    

    function createPeer(userToSignal, callerID, stream, name) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, name })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream, name) {

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID,name })
        })

        peer.signal(incomingSignal);

        return peer;

    }   

    function sendMsg(msg){
        setMessages([...messages,{name:'you',msg:msg,dt:new Date().toLocaleString(),sender:true}])
        socketRef.current.emit("message", {name:props.name,msg:msg,dt:new Date().toLocaleString(),sender:false})
    }

    const handleSnackClick = (msg) => {
        setSnackMsg(msg)
        setOpenSnack(true);
      };
    
      const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnack(false);
      };
    const muteUnmute = () => {
    const enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
        userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
        setMicToggleBtn(<MicOffIcon />)
    } else {
        setMicToggleBtn(<MicIcon />)
        userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
    }
    
    const playStop = () => {
    let enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
        userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
        setVideoToggleBtn(<VideocamOffIcon />)
    } else {
        setVideoToggleBtn(<VideocamIcon />)
        userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
    }
    }
    return (
        <React.Fragment>
            <Snackbar
            anchorOrigin={{
            vertical:'top',
            horizontal: 'left',
            }}
            open={openSnack}
            autoHideDuration={3000}
            onClose={handleSnackClose}
            message={snackMsg}
            />
           <AlertDialog  ref={childRef} defaultName={props.name} onOk={(name)=>create(name)} />
            <CssBaseline />
            <Grid container xs={12} direction="col" justify="space-around" alignItems="stretch" style={{height:'100vh',backgroundColor:'#090A0Bff',color:'#f6f5f4ff'}} alignContent="stretch">
                <Grid
                container
                item xs={12}
                direction="row"
                justify="flex-end"
                alignItems="flex-start">
                    <div className="menu">
                    <Tooltip title="Chat" aria-label="chat">
                        <IconButton onClick={()=>{(openSidebar)?setOpenSidebar(false):setOpenSidebar(true)}}>
                            <ForumIcon/>
                        </IconButton>
                    </Tooltip>
                    </div>
                    <Menu 
                    leave={()=>{socketRef.current.disconnect()}}  
                    inviteUrl={window.location.href} 
                    onCopyInvite={()=>handleSnackClick("Invite link copied to clipboard")}/>
                </Grid>
                <Grid
                container
                item xs={12}
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
                >
                    <Grid 
                        container
                        item xs={6} sm={6}
                        direction="column"
                        justify="space-evenly"
                        alignItems="center" 
                    >
                        
                    <video style={{maxWidth: '90%',maxHeight:'23vh'}} muted  ref={userVideo} autoPlay playsInline />
                    <h4>You</h4>
                    </Grid>
                    
                    {peers.map((peer) => {
                        return (
                            <CustomVideo key={peer.data.peerID} name={peer.data.name} peer={peer.peer} />
                        );
                    })}
                </Grid>
                <Grid
                container
                item xs={12}
                direction="row"
                justify="center"
                alignItems="flex-end">
                    <div style={{marginBottom:'20px'}}>
                    <IconButton style={{color:'#f6f5f4ff'}} onClick={muteUnmute}>
                        {micToggleBtn}
                    </IconButton>
                    <IconButton style={{color:'#f6f5f4ff'}} onClick={playStop}>
                        {videoToggleBtn}
                    </IconButton>
                    </div>
                </Grid>
                <Sidebar
                openSidebar={openSidebar}
                setOpenDraw={(open)=>setOpenSidebar(open)}
                avatar={{userId:props.userId,name:props.name}} 
                messages={messages}  
                sendMessage={(msg)=>sendMsg(msg)}/>
            </Grid>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
	return {
        userId:state.room.userId,
        roomId:state.room.roomId,
        name:state.room.name
	};
};

const mapDispatchToProps = dispatch => {
	return {
        join: (userId,roomId,name) => dispatch(actions.joinRoom(userId,roomId,name)),
        leave: ()=> dispatch(actions.leaveRoom())
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Room);
