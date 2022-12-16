import React, { useEffect } from 'react';
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
  console.log(room, 25);
  let roomUser = true;
  if (sessionStorage.getItem('urlLoginType') == 'guestUser') {
    console.log(room?.participants, 'room?.participants');
    if (room?.participants) {
      room?.participants.forEach((value, key) => {
        if (!value.identity.includes('_unAuthorized')) {
          roomUser = false;
          return;
        }
      });
    }
  } else {
    roomUser = false;
  }
  console.log(roomUser, 'roomuser');
  useEffect(() => {
    if (roomUser) {
      endCall();
    }
  }, [roomUser]);

  const endCall = async () => {
    let data;
    if (sessionStorage.getItem('roomDetail')) {
      let string = sessionStorage.getItem('roomDetail') || '';
      data = JSON.parse(string);
    }
    if (data) {
      return await rejectRequest(data.id, data.room, data.name, false, '', '')
        .then(data => {
          room!.disconnect();
          return;
        })
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
