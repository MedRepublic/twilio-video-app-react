import React, { useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppState } from '../../../state';
import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: '#E22525',
      color: 'white',
      '&:hover': {
        background: '#E22525',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { deleteRequest } = useAppState();
  let roomUser = true;
  if (sessionStorage.getItem('urlLoginType') == 'guestUser') {
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

  useEffect(() => {
    if (roomUser) {
      endCall();
    }
  }, [roomUser]);
  window.addEventListener('beforeunload', ev => {
    endCall();
  });
  const endCall = async () => {
    let data;
    if (sessionStorage.getItem('roomDetail')) {
      let string = sessionStorage.getItem('roomDetail') || '';
      data = JSON.parse(string);
    }
    if (data) {
      return await deleteRequest(data.id)
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
