import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducer'
import rootSagas from './sagas'
import {createSocketMiddleware} from './services/socket'

const sagaMiddleware = createSagaMiddleware()
const socketMiddleware = createSocketMiddleware()

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware, socketMiddleware)))

sagaMiddleware.run(rootSagas)

export default store