import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import './menu.css'
function Menu(props) {
    const history = useHistory();
    return (
        <div className="menu">
        <Tooltip title="Copy Invite link" aria-label="copy" >
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
    )
}

export default Menu
