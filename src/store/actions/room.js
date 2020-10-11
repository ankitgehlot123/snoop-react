import * as actionTypes from './actionTypes'

export const joinRoom = (userId,roomId, name) => {
	return {
		type: actionTypes.JOIN_ROOM,
		userId:userId,
        roomId: roomId,
		name:name
	};
};

export const leaveRoom = () => {
	return {
		type: actionTypes.LEAVE_ROOM,
	};
};

