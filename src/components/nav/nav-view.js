import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
  SwipeableDrawer,
  Badge,
  Link,
} from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios';
import { toast } from 'react-toastify';
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';
import { AuthContext } from '../app/AuthContext';
import { logout } from '../auth';
import NotificationDrawer from './components/notificationDrawer';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  matchaLogo: {
    flexGrow: 1,
  },
  navIcon: {
    color: 'white',
    '&:focus': {
      textDecoration: 'none',
    },
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary.main,
    },
    '&:visited': {
      textDecoration: 'none',
    },
    '&:link': {
      textDecoration: 'none',
    },
    '&:active': {
      textDecoration: 'none',
    },
  },
  notReadNotif: {
    backgroundColor: '#edf2fa',
  },
  noNotificationsDrawer: {
    margin: theme.spacing(1),
  },
}));

const Nav = () => {
  const classes = useStyles();
  const { authContext, socketContext } = useContext(AuthContext);
  const { token } = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [notifMenu, setNotifMenu] = React.useState({
    right: false,
  });

  useEffect(() => {
    const fetchTotalNotifications = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_PUBLIC_API_URL}/notification/total`,
          {
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'x-access-token': token,
            },
          },
        )
        .then(result => {
          setTotalNotifications(parseInt(result.data, 10));
        })
        .catch(error => {
          if (process.env.REACT_APP_VERBOSE === 'true') console.log(error);
        });
    };

    const fetchTotalMessages = async () => {
      await axios
        .get(`${process.env.REACT_APP_PUBLIC_API_URL}/chat/total`, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'x-access-token': token,
          },
        })
        .then(result => {
          setTotalMessages(parseInt(result.data, 10));
        })
        .catch(error => {
          if (process.env.REACT_APP_VERBOSE === 'true') console.log(error);
        });
    };
    fetchTotalNotifications();
    setTimeout(() => fetchTotalMessages(), 500);
  }, [token]);

  const fetchNotifications = async () => {
    await axios
      .get(`${process.env.REACT_APP_PUBLIC_API_URL}/notification`, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token': token,
        },
      })
      .then(result => {
        setNotifications(result.data);
      })
      .catch(error => {
        if (process.env.REACT_APP_VERBOSE === 'true') console.log(error);
      });
  };

  const toggleDrawer = open => async event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    if (open) {
      await fetchNotifications();
      setTotalNotifications(0);
    }
    setNotifMenu({ ...notifMenu, right: open });
  };

  const [toastDebounced] = useDebouncedCallback((sender, type) => {
    switch (type) {
      case 'message':
        toast('?????? You have a new message!');
        break;
      case 'match':
        toast('???? You have a new match!');
        break;
      case 'unmatch':
        toast('???? Sorry, you got unmatched...');
        break;
      case 'like':
        toast('???? Someone liked you!');
        break;
      case 'visit':
        toast('???? Someone visited your profile!');
        break;
      default:
    }
  }, 500);
  if (isLoggedIn) {
    socketContext.socket.on('new notification', (sender, type) => {
      if (type === 'message') {
        setTotalMessages(totalMessages + 1);
      }
      toastDebounced(sender, type);
    });
  }

  authContext.userData.then(data => {
    if (data) {
      setIsLoggedIn(data.success);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.matchaLogo}>
          <Link
            href="/"
            style={{ textDecoration: 'none' }}
            className={classes.navIcon}
          >
            Matcha
          </Link>
        </Typography>
        {isLoggedIn ? (
          <>
            <IconButton color="inherit" href="/chat">
              <Badge color="secondary" badgeContent={totalMessages} showZero>
                <ChatBubbleIcon className={classes.navIcon} />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleDrawer(true)} color="inherit">
              <Badge
                color="secondary"
                badgeContent={totalNotifications}
                showZero
              >
                <NotificationsIcon className={classes.navIcon} />
              </Badge>
            </IconButton>

            <IconButton color="inherit" href="profile">
              <AccountCircleIcon className={classes.navIcon} />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={e => {
                logout(e, setIsLoggedIn);
              }}
            >
              <ExitToAppIcon className={classes.navIcon} />
            </IconButton>
            <SwipeableDrawer
              anchor="right"
              open={notifMenu.right}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              <NotificationDrawer
                classes={classes}
                toggleDrawer={toggleDrawer}
                notifications={notifications}
              />
            </SwipeableDrawer>
          </>
        ) : (
          <>
            <Button color="inherit" href="/signup">
              Signup
            </Button>{' '}
            <Button color="inherit" href="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
