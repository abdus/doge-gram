import React, { ReactChild } from "react";
import { initialState, reducer, IInitialState } from "./reducer";
import { IReducerAction } from "./reducer";

export const GlobalContext = React.createContext<{
  state: IInitialState;
  dispatch(action: IReducerAction): void;
}>({
  state: initialState,
  dispatch: () => {},
});

export function ContextProvider(props: {
  children: React.ReactChild | React.ReactChildren;
}) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
