import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { useParams } from 'react-router-dom';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import Snackbar from '../../Snackbar/Snackbar';

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
  const { token: jwtToken } = useParams<{ token?: string }>();
  // const [snackError, snackSetError] = useState(false);
  const [waitingError, setWaitingError] = useState(false);
  const [callStartedError, setCallStartedError] = useState(false);
  // const
  const { createRoom, userRoomDetial, rejectRequest, isFetchingCreateRoom } = useAppState();
  const [newProcess, setProcess] = useState(0);
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;
  const [roomUserId, setRoomUserId] = useState(0);
  const [inRoomAdded, setInRoomAdded] = useState(false);
  const [myProcess, setmyProcess] = useState(false);

  const handleJoin = async () => {
    setProcess(0);
    setmyProcess(true);
    if (jwtToken) {
      await videoConnect(jwtToken);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(jwtToken);
      setRoomUserId(0);
    } else if (name && roomName && !inRoomAdded) {
      newCreateRoom(name, roomName, inRoomAdded);
    } else {
      setInRoomAdded(false);
      setRoomUserId(0);
    }
  };

  const userParticipant = async () => {
    if (roomUserId) {
      userRoomDetial(name, roomName)
        .then(async ({ data }) => {
          if (data.inRoomAdded) {
            setInRoomAdded(true);
          } else {
            setInRoomAdded(false);
            setRoomUserId(data.id);
          }
        })
        .catch(err => setRoomUserId(0));
    }
  };

  const newCreateRoom = (name: any, roomName: any, inRoomAdded: any) => {
    createRoom(name, roomName, inRoomAdded)
      .then(async ({ data }) => {
        if (data) {
          if (data?.inRoomAdded) {
            const id = String(data.id);
            rejectRequest(id)
              .then(data => setInRoomAdded(true))
              .catch(err => setRoomUserId(0));
          } else {
            setWaitingError(true);
            setInRoomAdded(false);
            setRoomUserId(data.id);
          }
        } else {
          setCallStartedError(true);
          setInRoomAdded(false);
          setRoomUserId(0);
        }
      })
      .catch(err => setRoomUserId(0));
  };

  useEffect(() => {
    setTimeout(async () => {
      setProcess(newProcess + 1);
      if (roomUserId) {
        await userParticipant();
      } else if (callStartedError && myProcess) {
        newCreateRoom(name, roomName, inRoomAdded);
      }
    }, 2000);

    console.log(newProcess, roomUserId, callStartedError, myProcess);
  }, [newProcess]);
  useEffect(() => {
    if (inRoomAdded) {
      generateToken();
    } else {
      setProcess(newProcess + 1);
    }
  }, [inRoomAdded]);

  const generateToken = () => {
    getToken(name, roomName).then(async ({ token: data }) => {
      await videoConnect(data);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(data);
      setRoomUserId(0);
    });
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
        open={waitingError}
        headline="Wait..."
        message="Waiting for organizer to connect you"
        variant="error"
        handleClose={() => setWaitingError(!waitingError)}
      />
      <Snackbar
        open={callStartedError}
        headline="Wait..."
        message="This call hasn’t started yet, please wait..."
        variant="error"
        handleClose={() => {
          setCallStartedError(!callStartedError);
          setmyProcess(false);
        }}
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
