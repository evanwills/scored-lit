// import { PayloadAction } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
// import { Middleware, Reducer, StoreEnhancer } from 'redux';

export const logger : Middleware = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
};

/**
 * Emit a DOM event that the store is watching for
 *
 * @param element element (or custom element) emitting the event
 * @param payload Action Creator action to be dispatched to the
 *                Redux store
 */
export const sendToStore = (element: HTMLElement, payload : any) : void => {
  element.dispatchEvent(new CustomEvent(
    'redux-dispatch',
    {
      bubbles: true, // only bubbles and cancelable
      cancelable: true, // work in the Event constructor

      detail: payload,
    },
  ));
};

// const round = (number: number) : number => (Math.round(number * 100) / 100);

// export const monitorReducerEnhancer : StoreEnhancer =
//   (createStore) => (reducer, initialState, enhancer) => {
//     const monitoredReducer : Reducer = (state, action) => {
//       const start = performance.now()
//       const newState = reducer(state, action)
//       const end = performance.now()
//       const diff = round(end - start)

//       console.log('reducer process time:', diff)

//       return newState
//     }

//     return createStore(monitoredReducer, initialState, enhancer)
//   }
