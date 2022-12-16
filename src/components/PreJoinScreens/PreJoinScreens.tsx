import jwt_decode from 'jwt-decode';
// import jwt from 'jsonwebtoken';
import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
// const {  verify } = jwt;
export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}
// function parseJwt(token: any) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split('')
//       .map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join('')
//   );
//   return JSON.parse(jsonPayload);
// }
export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName } = useParams<{ URLRoomName?: string }>();
  const { token } = useParams<{ token?: string }>();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  const [mediaError, setMediaError] = useState<Error>();
  const [snackError, snackSetError] = useState<Boolean>(false);
  useEffect(() => {
    if (token) {
      try {
        let decoded: any = jwt_decode(token);
        if (decoded) {
          sessionStorage.setItem('urlLoginType', 'tokenUser');
          if (decoded?.grants && decoded?.grants?.video && decoded?.grants?.video?.room) {
            setRoomName(decoded?.grants?.video?.room);
          }
          if (decoded?.grants && decoded?.grants?.identity) {
            setName(decoded?.grants?.identity);
            setStep(Steps.deviceSelectionStep);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      sessionStorage.setItem('urlLoginType', 'guestUser');
    }
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
    if (user?.displayName && roomName) {
      setName(user?.displayName);
      setStep(Steps.deviceSelectionStep);
    }
  }, [user, URLRoomName]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    // @ts-ignore
    if (!window.location.origin.includes('twil.io') && !window.STORYBOOK_ENV) {
      window.history.replaceState(null, '', window.encodeURI(`/roomName/${roomName}${window.location.search || ''}`));
    }
    setStep(Steps.deviceSelectionStep);
  };

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      {step === Steps.roomNameStep && (
        <RoomNameScreen
          name={name}
          roomName={roomName}
          setName={setName}
          setRoomName={setRoomName}
          handleSubmit={handleSubmit}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen
          name={name}
          roomName={roomName}
          snackError={false}
          setStep={setStep}
          snackSetError={snackSetError}
        />
      )}
    </IntroContainer>
  );
}
