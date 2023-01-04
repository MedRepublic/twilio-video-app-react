import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
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
    const loginType = sessionStorage.getItem('urlLoginType');
    setTimeout(() => {
      if (!open && room?.name && !count.length && loginType == 'tokenUser') {
        roomUndefined(room?.name);
      } else {
        setProcess(process + 1);
      }
    }, 1000);
  }, [process]);
  const roomUndefined = async (roomName: any) => {
    await getRoomUndefined(roomName, localParticipant?.identity).then(async ({ data }) => {
      if (data.length && open === false) {
        if (!count) {
          setProcess(process + 1);
        } else {
          setCount(data);
          setOpen(true);
        }
      } else {
        setOpen(false);
        setProcess(process + 1);
      }

      // }
    });
  };

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
    acceptRequest(count[0]?.id, count[0]?.room, count[0]?.name, true, localParticipant?.identity, '').then(
      async ({ data }) => {
        if (data) {
          setOpen(false);
        }
        setProcess(process + 1);
      }
    );
    setOpen(false);
    setCount([]);
    setProcess(process + 1);
  };
  const handleCloseDisagree = () => {
    rejectRequest(count[0]?.id, count[0]?.room, count[0]?.name, false, '', localParticipant?.identity).then(
      async ({ data }) => {
        if (data) {
          setOpen(false);
        }
        setProcess(process + 1);
      }
    );
    setOpen(false);
    setCount([]);
    setProcess(process + 1);
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
            <DialogTitle>
              {' '}
              <b>{count[0].name}</b> has requested to join this call
            </DialogTitle>

            <DialogActions>
              <Button onClick={handleCloseDisagree}>Reject</Button>
              <Button onClick={handleCloseAgree}>Accept</Button>
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
