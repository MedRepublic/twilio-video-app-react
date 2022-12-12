import React, { createContext, useContext, useReducer, useState } from 'react';
import { RecordingRules, RoomType } from '../types';
import { TwilioError } from 'twilio-video';
import { settingsReducer, initialSettings, Settings, SettingsAction } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import { useLocalStorageState } from '../hooks/useLocalStorageState/useLocalStorageState';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';
import { User } from 'firebase/auth';

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(name: string, room: string, passcode?: string): Promise<{ room_type: RoomType; token: string }>;
  createRoom(
    name: string,
    room: string,
    inRoomAdded: boolean,
    passcode?: string
  ): Promise<{
    room_type: RoomType;
    token: string;
    data: {
      createdAt: Date;
      id: number;
      inRoomAdded: boolean;
      roomName: string;
      updatedAt: Date;
      userName: string;
    };
  }>;
  userRoomDetial(
    name: string,
    room: string
  ): Promise<{
    room_type: RoomType;
    token: string;
    data: {
      createdAt: Date;
      id: number;
      inRoomAdded: boolean;
      roomName: string;
      updatedAt: Date;
      userName: string;
    };
  }>;
  getRoomUndefined(
    room: string,
    name: string
  ): Promise<{
    room_type: RoomType;
    token: string;
    data: [
      {
        createdAt: Date;
        id: number;
        inRoomAdded: boolean;
        roomName: string;
        updatedAt: Date;
        userName: string;
      }
    ];
  }>;
  acceptRequest(
    id: number,
    room: string,
    name: string
  ): Promise<{
    room_type: RoomType;
    token: string;
    data: [
      {
        createdAt: Date;
        id: number;
        inRoomAdded: boolean;
        roomName: string;
        updatedAt: Date;
        userName: string;
      }
    ];
  }>;
  rejectRequest(
    room: string
  ): Promise<{
    room_type: RoomType;
    token: string;
    data: [
      {
        createdAt: Date;
        id: number;
        inRoomAdded: boolean;
        roomName: string;
        updatedAt: Date;
        userName: string;
      }
    ];
  }>;
  getTokenEncode(token: string): Promise<{ name: string; room_type: RoomType; token: string }>;
  user?: User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  isFetchingCreateRoom: boolean;
  isFetchingRoomUndefined: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  updateRecordingRules(room_sid: string, rules: RecordingRules): Promise<object>;
  isGalleryViewActive: boolean;
  setIsGalleryViewActive: React.Dispatch<React.SetStateAction<boolean>>;
  maxGalleryViewParticipants: number;
  setMaxGalleryViewParticipants: React.Dispatch<React.SetStateAction<number>>;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingCreateRoom, setIsFetchingCreateRoom] = useState(false);
  const [isFetchingRoomUndefined, setIsFetchingRoomUndefined] = useState(false);
  const [isGalleryViewActive, setIsGalleryViewActive] = useLocalStorageState('gallery-view-active-key', true);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);
  const [roomType, setRoomType] = useState<RoomType>();
  const [maxGalleryViewParticipants, setMaxGalleryViewParticipants] = useLocalStorageState(
    'max-gallery-participants-key',
    6
  );

  let contextValue = {
    error,
    setError,
    isFetching,
    isFetchingCreateRoom,
    isFetchingRoomUndefined,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    roomType,
    isGalleryViewActive,
    setIsGalleryViewActive,
    maxGalleryViewParticipants,
    setMaxGalleryViewParticipants,
  } as StateContextType;

  if (process.env.REACT_APP_SET_AUTH === 'firebase') {
    contextValue = {
      ...contextValue,
      ...useFirebaseAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    contextValue = {
      ...contextValue,
      ...usePasscodeAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else {
    contextValue = {
      ...contextValue,
      getToken: async (user_identity, room_name) => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';

        return fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            user_identity,
            room_name,
            create_conversation: process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true',
          }),
        })
          .then(res => res.json())
          .catch(err => console.log(err));
      },

      updateRecordingRules: async (room_sid, rules) => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/recordingrules';

        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room_sid, rules }),
          method: 'POST',
        })
          .then(async res => {
            const jsonResponse = await res.json();

            if (!res.ok) {
              const recordingError = new Error(
                jsonResponse.error?.message || 'There was an error updating recording rules'
              );
              recordingError.code = jsonResponse.error?.code;
              return Promise.reject(recordingError);
            }
            return jsonResponse;
          })
          .catch(err => setError(err));
      },
      createRoom: async (name, room, inRoomAdded) => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/room/token';
        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, room, inRoomAdded }),
          method: 'POST',
        })
          .then(async res => {
            return await res.json();
          })
          .catch(err => setError(err));
      },
      userRoomDetial: async (name, room) => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/room/detail';
        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, room }),
          method: 'POST',
        })
          .then(async res => {
            const jsonResponse = await res.json();

            if (!res.ok) {
              const roomError = new Error('Your connection request was not accepted');
              roomError.code = jsonResponse.error?.code;
              return Promise.reject(roomError);
            }
            return jsonResponse;
          })
          .catch(err => setError(err));
      },
      getRoomUndefined: async room => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/room/request/' + room;
        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ room }),
          method: 'GET',
        })
          .then(async res => {
            const jsonResponse = await res.json();

            if (!res.ok) {
              const roomError = new Error(jsonResponse.message || 'Something went wrong...');
              roomError.code = jsonResponse.error?.code;
              return Promise.reject(roomError);
            }
            return jsonResponse;
          })
          .catch(err => setError(err));
      },
      acceptRequest: async (id, roomName, name) => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/room/roomRequest/' + id;
        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room: roomName, name }),
          method: 'PUT',
        })
          .then(async res => {
            const jsonResponse = await res.json();

            if (!res.ok) {
              const roomError = new Error(jsonResponse.message || 'Your connection request was not accepted');
              roomError.code = jsonResponse.error?.code;
              return Promise.reject(roomError);
            }
            return jsonResponse;
          })
          .catch(err => setError(err));
      },
      rejectRequest: async roomId => {
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/room/deleteRequest/' + roomId;
        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ room }),
          method: 'DELETE',
        })
          .then(async res => {
            const jsonResponse = await res.json();

            if (!res.ok) {
              const roomError = new Error(jsonResponse.error?.message || 'Your connection request was not rejected');
              roomError.code = jsonResponse.code;
              return Promise.reject(roomError);
            }
            return jsonResponse;
          })
          .catch(err => setError(err));
      },
    };
  }

  const getToken: StateContextType['getToken'] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        setRoomType(res.room_type);
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };
  const getTokenEncode: StateContextType['getTokenEncode'] = token => {
    setIsFetching(true);
    return contextValue
      .getTokenEncode(token)
      .then(res => {
        setRoomType(res.room_type);
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };
  const updateRecordingRules: StateContextType['updateRecordingRules'] = (room_sid, rules) => {
    setIsFetching(true);
    return contextValue
      .updateRecordingRules(room_sid, rules)
      .then(res => {
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };
  const createRoom: StateContextType['createRoom'] = (room, name, inRoomAdded) => {
    setIsFetchingCreateRoom(true);
    return contextValue
      .createRoom(room, name, inRoomAdded)
      .then(res => {
        setIsFetchingCreateRoom(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetchingCreateRoom(false);
        return Promise.reject(err);
      });
  };

  const userRoomDetial: StateContextType['userRoomDetial'] = (room, name) => {
    setIsFetchingCreateRoom(true);
    return contextValue
      .userRoomDetial(room, name)
      .then(res => {
        setIsFetchingCreateRoom(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetchingCreateRoom(false);
        return Promise.reject(err);
      });
  };
  const getRoomUndefined: StateContextType['getRoomUndefined'] = (room, name) => {
    setIsFetchingRoomUndefined(true);
    return contextValue
      .getRoomUndefined(room, name)
      .then(res => {
        setIsFetchingCreateRoom(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetchingCreateRoom(false);
        return Promise.reject(err);
      });
  };
  const acceptRequest: StateContextType['acceptRequest'] = (id, room, name) => {
    setIsFetchingRoomUndefined(true);
    return contextValue
      .acceptRequest(id, room, name)
      .then(res => {
        setIsFetchingCreateRoom(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetchingCreateRoom(false);
        return Promise.reject(err);
      });
  };

  const rejectRequest: StateContextType['rejectRequest'] = room => {
    setIsFetchingRoomUndefined(true);
    return contextValue
      .rejectRequest(room)
      .then(res => {
        setIsFetchingCreateRoom(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetchingCreateRoom(false);
        return Promise.reject(err);
      });
  };

  return (
    <StateContext.Provider
      value={{
        ...contextValue,
        getToken,
        updateRecordingRules,
        getTokenEncode,
        userRoomDetial,
        createRoom,
        getRoomUndefined,
        acceptRequest,
        rejectRequest,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
