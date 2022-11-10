import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import Snackbar from '../../Snackbar/Snackbar';
import axios from 'axios';
import { Participant } from '../../Participant/Participant';
import AlertDialogSlide from '../../DiaglogBox/DialogBox';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  snackError: boolean;
  snackSetError: (snackError: boolean) => void;
  setStep: (step: Steps) => void;
}
type CreateUserResponse = {
  name: string;
  job: string;
  id: string;
  createdAt: string;
};

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  // const [activeSnackbar, setActiveSnackbar] = useState(Snackbars.none);
  const { getToken, isFetching } = useAppState();
  const [snackError, snackSetError] = useState(false);
  // const
  const { createRoom, isFetchingCreateRoom } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  // const backendApi = async (name: string, roomName: string) => {
  //   try {
  //     // 👇️ const data: CreateUserResponse
  //     const { data } = await axios.post<CreateUserResponse>(
  //       '/api/users',
  //       { name, roomName },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //       }
  //     );

  //     console.log(JSON.stringify(data, null, 4));

  //     return data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log('error message: ', error.message);
  //       // 👇️ error: AxiosError<any, any>
  //       return error.message;
  //     } else {
  //       console.log('unexpected error: ', error);
  //       return 'An unexpected error occurred';
  //     }
  //   }
  // };
  const handleJoin = () => {
    if (name.includes('Unauthorized')) {
      createRoom(name, roomName).then(async ({ data }) => {
        if (data?.inRoomAdded) {
          console.log(data);
          getToken(name, roomName).then(async ({ token }) => {
            console.log(name, roomName, token, 'name, roomName, token');
            console.log(name.includes('Unauthorized'));

            // videoConnect(token);
            // process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
          });
          // }
        }
      });
    } else {
      createRoom(name, roomName).then(async ({ data }) => {
        if (data?.inRoomAdded) {
          console.log(data);

          getToken(name, roomName).then(async ({ token }) => {
            console.log(name, roomName, token, 'name, roomName, token');
            console.log(name.includes('Unauthorized'));

            videoConnect(token);
            process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
          });
          // }
        } else {
          console.log(!Boolean(data?.inRoomAdded));
          snackSetError(!Boolean(data?.inRoomAdded));
        }
      });
    }
  };

  if (isFetching || isConnecting) {
    return (
      <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Joining Meeting
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      {/* <AlertDialogSlide /> */}
      <Snackbar
        open={snackError}
        headline="Process..."
        message="Your request has been sent to enter the room"
        variant="error"
        handleClose={() => snackSetError(!snackError)}
      />
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName}
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: '80%' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButtons}
              >
                Join Now
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
