import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledVideo = styled.video`
width: 90%;
`;
const Styledh4 = styled.h4`
max-width:100px;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
`;
const CustomVideo = (props) => {
const ref = useRef();
const progressRef = useRef();
const [name,setName]=useState("");
useEffect(() => {
    if(typeof props.peer.on === 'function'){
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
            progressRef.current.remove();
            ref.current.style.display = 'block';
            setName(props.name);
        })
        props.peer.on("close", ()=> {
            if(ref.current){
                ref.current.remove()
            }
        })
    }

});
return (
    <Grid 
        container
        item xs={12} sm={6}
        direction="column"
        justify="space-evenly"
        style={{color:'#d3d0cbff'}}
        alignItems="center" >
    <CircularProgress ref={progressRef}/>
    <StyledVideo style={{display:'none'}} controls playsInline autoPlay ref={ref} />
    <Styledh4>{name}</Styledh4>
    </Grid>
);
}
export default CustomVideo;