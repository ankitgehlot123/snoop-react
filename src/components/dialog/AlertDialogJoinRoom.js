import React,{forwardRef, useImperativeHandle } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const  AlertDialogJoin = forwardRef(({onOk}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [roomLink,setRoomLink] = React.useState()
  
  useImperativeHandle(
    ref,
    () => ({
      handleClickOpen:() => {
        setOpen(true);
      }
    }),
)


  const handleClose = () => {
    setOpen(false);
  };
  const handleOk=()=>{
    if(roomLink && roomLink.length>0){
      onOk(roomLink);
      handleClose()
    }
  }
  return (
      <Dialog 
      ref={ref}
      open={open} 
      onClose={handleClose} 
      fullWidth={true}
      disableBackdropClick={true}
      maxWidth='xs'
      aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter your Room invitation link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Invitation link"
            input={roomLink}
            defaultValue={roomLink}
            onChange={(e)=>setRoomLink(e.target.value)}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
        <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleOk} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
  );
})

export default AlertDialogJoin