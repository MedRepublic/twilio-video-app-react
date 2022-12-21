import React, { useEffect, useRef, useState } from 'react';
import { TwilioError } from 'twilio-video';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
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
import SettingsIcon from '../../../icons/SettingsIcon';
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
        height: '40',
        width: '35',
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
    height: 40,
    width: 40,
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
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting || isFetchingCreateRoom;
  const [roomUserId, setRoomUserId] = useState(0);
  const [inRoomAdded, setInRoomAdded] = useState(false);
  const [myProcess, setmyProcess] = useState(false);
  const [error, setError] = useState<TwilioError | null>(null);
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = useState<any>([]);

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
      userRoomDetial(roomUserId)
        .then(async ({ data }) => {
          if (data.inRoomAdded == true) {
            sessionStorage.setItem('roomDetail', JSON.stringify(data));
            setInRoomAdded(true);
            setProcess(newProcess + 1);
          } else if (data.inRoomAdded == false) {
            sessionStorage.setItem('roomDetail', JSON.stringify(data));
            let array = [data];
            setCount(array);
            setOpen(true);
            setInRoomAdded(false);
            setRoomUserId(0);
          } else {
            setInRoomAdded(false);
            setRoomUserId(data.id);
            setProcess(newProcess + 1);
          }
        })
        .catch(err => setRoomUserId(0));
    } else {
      setProcess(newProcess + 1);
    }
  };

  const newCreateRoom = (name: any, roomName: any, inRoomAdded: any) => {
    createRoom(name, roomName, inRoomAdded)
      .then(async ({ data }) => {
        if (data) {
          const id = String(data.id);
          localStorage.setItem('roomId', id);

          setWaitingError(true);
          setInRoomAdded(false);
          setRoomUserId(data.id);
          setProcess(newProcess + 1);
        } else {
          setCallStartedError(true);
          setInRoomAdded(false);
          setRoomUserId(0);
        }
      })
      .catch(err => setRoomUserId(0));
  };

  useEffect(() => {
    if (roomUserId) {
      userParticipant();
    } else if (callStartedError && myProcess) {
      newCreateRoom(name, roomName, inRoomAdded);
    }

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
    let data;
    if (sessionStorage.getItem('roomDetail')) {
      let string = sessionStorage.getItem('roomDetail') || '';
      data = JSON.parse(string);
    }
    getToken(`${name} _unAuthorized (Accepted By: ${data?.acceptedBy})`, roomName).then(async ({ token: data }) => {
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
  const handleCloseAgree = () => {
    setOpen(false);
    setCount([]);
  };
  const handleCloseDisagree = () => {
    setOpen(false);
    setCount([]);
  };
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  console.log(count, 'count');
  return (
    <>
      {count.length ? (
        <>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDisagree}
            aria-describedby="alert-dialog-slide-description"
          >
            {/* <DialogTitle>{'Someone want to join room'}</DialogTitle> */}
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Your connection request was not accepted
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAgree}>Ok</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <></>
      )}
      {/* <AlertDialogSlide /> */}
      <Snackbar
        open={waitingError}
        headline="Wait..."
        message="We have notified the Doctor you are here"
        variant="error"
        handleClose={() => setWaitingError(!waitingError)}
      />
      <Snackbar
        open={callStartedError}
        headline="Wait..."
        message="This call hasn’t started yet..."
        variant="error"
        handleClose={() => {
          setCallStartedError(!callStartedError);
          setmyProcess(false);
        }}
      />
      <Typography variant="h5" className={classes.gutterBottom}>
        <b>Dr. {roomName.split('_')[0]}</b> Telehealth Call
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
            <Button
              // ref={anchorRef}
              // onClick={() => setMenuOpen(true)}
              startIcon={<SettingsIcon />}
              // className={classes.settingsButton}
            >
              Settings
            </Button>
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
      <Grid container justifyContent="center">
        <div className={classes.joinButtons}>
          <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" data-cy-join-now onClick={handleJoin} disabled={disableButtons}>
            Join Now
          </Button>
        </div>
      </Grid>
    </>
  );
}
