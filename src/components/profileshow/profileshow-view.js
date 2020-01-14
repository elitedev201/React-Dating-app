import React, { useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import ProfileShowContainer from './profileshow-container';
import UpperBoxProfile from '../profile/components/upperBoxProfile';
import { AuthContext } from '../app/AuthContext';
import UseProfileForm from '../profile/profile-container';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  progress: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperProfile: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '1500px',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    fontSize: '1em',
    padding: theme.spacing(1),
  },
  boxUpProfile: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerUpProfile: {
    maxWidth: '1500px',
  },
  LeftColumnPublicProfile: {
    padding: theme.spacing(1),
  },
  pictureContainer: {
    padding: theme.spacing(1),
    position: 'relative',
    width: '100%',
    height: 'fit-content',
  },
  pictureButtonContainer: {
    overflow: 'hidden',
    backgroundColor: 'green',
    position: 'relative',
    height: 'fit-content',
    width: '100%',
  },
  picture: {
    objectFit: 'cover',
  },
  deleteButtonPicture: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '0px',
  },
  profilePicture: {
    border: '3px solid',
    borderColor: theme.palette.secondary.main,
    boxSizing: 'border-box',
    objectFit: 'cover',
  },
  tabs: {
    margin: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(1),
  },
  summaryField: {
    width: '90%',
  },
  interestChips: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  paperAccount: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(5, 2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.A300,
  },
  divAccount: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const ProfileShow = ({ computedMatch }) => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const visitedUsername = computedMatch.params.username;

  const {
    // handleProfileChange,
    // handleDeleteImage,
    // profile,
    // loaded,
    // submitFile,
    // handleFileUpload,
    // handleChangeProfileImage,
    // handleInterestChange,
    // handleChangeLocation,
    handleChangeCity,
    // handleSubmitParameters,
    // isChecked,
    getAge,
    // fetchInterests,
    // deleteUser,
    // showModal,
    // setShowModal,
    // imageToSave,
    // setImageToSave,
    // croppedImage,
    // setCroppedImage,
    // upload,
    // finalImage,
    // sendCroppedImageServer,
  } = UseProfileForm(authContext.userData, authContext.token);
  const { visitedProfile, loaded } = ProfileShowContainer(visitedUsername);

  if (loaded === false) {
    return (
      <div className={classes.progress}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <>
      <UpperBoxProfile
        classes={classes}
        profile={visitedProfile}
        getAge={getAge}
        handleChangeCity={handleChangeCity}
      />
      <Divider className={classes.divider} />
      <Grid container>
        <Grid
          container
          sm={6}
          bgcolor="primary.main"
          direction="column"
          className={classes.LeftColumnPublicProfile}
        >
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">
              {visitedProfile.firstname} identifies as
            </Box>
          </Typography>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">
              {visitedProfile.firstname} is looking for
            </Box>
          </Typography>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">
              {visitedProfile.firstname} in a few words
            </Box>
          </Typography>
        </Grid>
        <Grid container sm={6} className={classes.LeftColumnPublicProfile}>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">
              {visitedProfile.firstname}'s pictures
            </Box>
          </Typography>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">
              {visitedProfile.firstname}'s interests
            </Box>
          </Typography>
        </Grid>
      </Grid>
      {_.map(visitedProfile, temporaryField => (
        <p>{temporaryField}</p>
      ))}
    </>
  );
};

export default ProfileShow;
