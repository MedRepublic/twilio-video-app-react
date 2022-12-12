import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppState } from '../../../state';
import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#2E5BFF',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { createRoom, userRoomDetial, rejectRequest, isFetchingCreateRoom } = useAppState();
  console.log(room?.localParticipant?.identity, room?.name, 'endCall');

  const endCall = async () => {
    let roomId = localStorage.getItem('roomId');
    console.log('here', roomId);
    if (roomId) {
      await rejectRequest(roomId)
        .then(data => room!.disconnect())
        .catch(err => {});
    } else {
      room!.disconnect();
    }
  };
  return (
    <Button onClick={() => endCall()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}
