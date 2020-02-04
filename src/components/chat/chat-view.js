import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import ChatContainer from './chat-container';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';

// import io from 'socket.io-client';
// let socket = io(`http://localhost:3001`);
const useStyles = makeStyles(theme => ({}));

const Chat = () => {
  const classes = useStyles();
  const { matchList } = ChatContainer();

  // const [message, setMessage] = useState('');
  // const [messageList, setMessageList] = useState([]);
  // const { authContext, socketContext } = useContext(AuthContext);

  // console.log(socketContext.userId);
  // socketContext.socket.on('chat message', msg => {
  //   console.log(msg);
  //   setMessageList(messageList.concat({ sendername: 'yann', msg: msg }));
  //   console.log(messageList);
  // });

  // const handleMessage = event => {
  //   setMessage(event.target.value);
  // };

  // const sendMessage = () => {
  //   socketContext.socket.emit('chat message', message);
  //   setMessage('');
  //   setMessageList(messageList.concat({ sendername: 'yann', msg: message }));
  // };

  return (
    <>
      {/* <TextField
        onChange={handleMessage}
        value={message}
        type="text"
        name="message"
      />
      <Button onClick={sendMessage} variant="contained">
        Send
      </Button> */}
      <List className={classes.root}>
        {_.map(matchList, matchedProfile => {
          let redirectLink = '/chatroom/' + matchedProfile.matchid;
          return (
            <>
              <Button href={redirectLink}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="avatar" src={matchedProfile.profilePicture} />
                  </ListItemAvatar>
                  <ListItemText primary={matchedProfile.firstname} />
                </ListItem>
              </Button>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
    </>
  );
};

export default Chat;
