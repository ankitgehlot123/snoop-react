import * as actionTypes from '../actions/actionTypes'

const initialState = {
    roomId: null,
    userId:null,
    name:null
}

const leaveRoom = (state) => {
	return {
		...state,
		roomId: null,
        userId: null,
        name: null
	};
};
const joinRoom = (state, action) => {
	return {
		...state,
        roomId: action.roomId,
        userId: action.userId,
        name: action.name
	}
};

const reducer = (state = initialState, action) =>{
    
    switch (action.type){
        case actionTypes.JOIN_ROOM:
            return joinRoom(state,action)
        case actionTypes.LEAVE_ROOM:
            return leaveRoom(state)
        default:
            return state;
    }
}

export default reducer;