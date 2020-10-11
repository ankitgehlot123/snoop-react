import React,{useRef} from "react";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
import './home.css'
import * as actions from "../../store/actions"
import VideocamIcon from '@material-ui/icons/Videocam';
import Button from '@material-ui/core/Button';
import AlertDialog from "../dialog/AlertDialogJoinRoom"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
const Home = (props) => {
    const childRef = useRef();
    if(props.roomId)
        props.leave()
    const createRoom =()=>{
        const roomId = uuid();
        props.history.push(`/room/${roomId}`);
    }
    const joinRoom =(link)=>{
        props.history.push("/room/"+link.split("/room/")[1]);
    }

    return (
        <div className="login">
            <div className='login__container'>
                <div className='login__container__text'>                              
                    <h1>Snoop</h1>
                </div>
                <Button      
                    onClick={createRoom}
                    variant="contained"
                    color="primary"
                    className="login__container__btn"
                    endIcon={<VideocamIcon />}
                >
                   Create Room
                </Button>
                <span style={{fontSize:'small'}}>or</span>
                <Button      
                    onClick={()=>childRef.current.handleClickOpen()}
                    variant="contained"
                    color="primary"
                    className="login__container__btn"
                    endIcon={<PersonAddIcon />}
                >
                   Join Room
                </Button>
            </div>
            <AlertDialog  ref={childRef} onOk={(link)=>joinRoom(link)} />
        </div>
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
        leave: ()=> dispatch(actions.leaveRoom())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
