import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import roomReducer from "./store/reducers/room";
import { createStore, combineReducers} from "redux";
import { persistReducer,persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import createSaga Middleware from "redux-saga";
// import { createStore, applyMiddleware, combineReducers, compose } from "redux";
// import {watchRoom} from "./store/sagas";

const rootReducer = combineReducers({
	room: roomReducer,
});
const persistConfig = {
  key: 'room',
  storage: storage,
  whitelist: ['room'] // which reducer want to store
};
const pReducer = persistReducer(persistConfig, rootReducer);
// const sagaMiddleware = createSagaMiddleware();

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	pReducer,
// composeEnhancers(applyMiddleware(sagaMiddleware))
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// sagaMiddleware.run(watchRoom);

const app = (
  <Provider store={store}>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </Provider>
)
persistStore(store,null,()=>{
  ReactDOM.render(
    app,
    document.getElementById('root')
  );
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
