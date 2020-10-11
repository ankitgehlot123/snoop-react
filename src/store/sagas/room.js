import { put } from "redux-saga/effects";
import * as actions from "../actions";

export function* joinRoomSaga(action) {
		yield localStorage.setItem("roomId", action.roomId);
        yield localStorage.setItem("userId", action.userId);
        yield localStorage.setItem("name",action.name)
		yield put(actions.joinRoom(action.userId,action.roomId,action.name));
}
export function* leaveRoomSaga() {
	yield localStorage.removeItem("roomId");
	yield localStorage.removeItem("name");
	yield localStorage.removeItem("userId");
	yield put(actions.leaveRoom());
}
