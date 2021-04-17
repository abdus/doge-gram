import firebase from "firebase";

export interface IReducerAction {
  payload: any;
  type: "AUTH" | "SIGN_OUT" | "ALL_POSTS";
}

export interface IUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface IInitialState {
  auth_user?: IUser;
  all_posts?: IPost[];
}

export interface IPost {
  media: string[];
  caption: string;
  isPrivate: boolean;
  createdAt: firebase.firestore.FieldValue;
  author: firebase.firestore.DocumentReference;
}

export const initialState: IInitialState = {};

export function reducer(state: any, action: IReducerAction) {
  switch (action.type) {
    case "AUTH": {
      return {
        ...(state || {}),
        auth_user: { ...(action.payload || {}) },
      };
    }

    case "SIGN_OUT": {
      return {
        ...(state || {}),
        auth_user: undefined,
      };
    }

    case "ALL_POSTS": {
      return {
        ...(state || {}),
        all_posts: action.payload,
      };
    }
  }
}
