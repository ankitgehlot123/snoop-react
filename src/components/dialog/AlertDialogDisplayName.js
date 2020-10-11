import React,{forwardRef, useImperativeHandle } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const  AlertDialog = forwardRef(({onOk,defaultName}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [displayName,setDisplayName] = React.useState(defaultName)
  
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
    if(displayName && displayName.length>0){
      onOk(displayName);
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
        <DialogTitle id="form-dialog-title">Enter your display name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            input={displayName}
            defaultValue={displayName}
            onChange={(e)=>setDisplayName(e.target.value)}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleOk} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
  );
})

export default AlertDialog