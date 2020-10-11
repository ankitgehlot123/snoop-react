import { takeEvery, all } from "redux-saga/effects";

import * as actionTypes from "../actions/actionTypes";

import {
	joinRoomSaga,
	leaveRoomSaga,
} from "./room";

export function* watchRoom() {
	yield all([
		takeEvery(actionTypes.JOIN_ROOM, joinRoomSaga),
		takeEvery(actionTypes.LEAVE_ROOM, leaveRoomSaga),
	]);
}
