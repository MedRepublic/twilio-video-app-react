import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
export default function MainParticipant() {
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const { getRoomUndefined, acceptRequest, rejectRequest, isFetchingRoomUndefined } = useAppState();
  const localParticipant = room!.localParticipant;
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = useState<any>([]);
  const [process, setProcess] = useState(1);
  useEffect(() => {
    roomUndefined();
  });
  const roomUndefined = () => {
    // console.log(room?.name);
    setTimeout(() => {
      setProcess(process + 1);
      if (room?.name)
        getRoomUndefined(room?.name, localParticipant?.identity).then(async ({ data }) => {
          if (data[0]?.id !== count[0]?.id) {
            setCount(data);
            if (data.length) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }

          // }
        });
    }, 5000);
    // console.log('here')
  };
  // console.log(count);
  // console.log(process);
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const videoPriority =
    (mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? 'high'
      : null;

  const handleCloseAgree = () => {
    // console.log('trigger Agree');
    acceptRequest(count[0]?.id, count[0]?.room, count[0]?.name).then(async ({ data }) => {
      if (data) {
        setOpen(false);
      }
      // console.log(data, count);
      // if (data?.inRoomAdded) {
      // if (data[0]?.id !== count[0]?.id) {
      //   setCount(data);
      //   if (data.length) {
      //     setOpen(true);
      //   } else {
      //     setOpen(false);
      //   }
      // }

      // }
    });
    // setOpen(false);
  };
  const handleCloseDisagree = () => {
    // console.log('trigger Disagree');
    rejectRequest(count[0]?.id).then(async ({ data }) => {
      if (data) {
        setOpen(false);
      }
      // }
    });
    setOpen(false);
  };
  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <>
      {' '}
      {count.length ? (
        <div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDisagree}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{'Someone want to join room'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <b>{count[0].userName}</b> has request to join this call
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDisagree}>Disagree</Button>
              <Button onClick={handleCloseAgree}>Agree</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        ''
      )}
      <MainParticipantInfo participant={mainParticipant}>
        <ParticipantTracks
          participant={mainParticipant}
          videoOnly
          enableScreenShare={mainParticipant !== localParticipant}
          videoPriority={videoPriority}
          isLocalParticipant={mainParticipant === localParticipant}
        />
      </MainParticipantInfo>{' '}
    </>
  );
}
