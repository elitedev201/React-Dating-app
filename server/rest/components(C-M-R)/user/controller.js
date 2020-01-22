const { sendSigninEmail } = require('../../../mailer/sendSigninEmail');
const {
  UserInputTests,
  saveVisit,
  checkIfProfileCompleted,
} = require('./utils');
const UserValidation = require('./../userValidation/model');
const User = require('./model');
const Like = require('./../like/model');
const Block = require('./../block/model');
const { deleteFile } = require('../images/controller');

const user = new User();
const check = new UserInputTests(user);
const userValidation = new UserValidation(user);
const like = new Like();
const block = new Block();

async function getUsers(request, response) {
  try {
    const call = await user.getAll();
    response.status(200).json(call);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function getMyUserInfo(request, response) {
  const id = request.decoded.userid;
  try {
    const call = await user.getByFiltered('id', id, [
      'firstname',
      'surname',
      'username',
      'email',
      'location',
      'birthDate',
      'popularityRate',
      'gender',
      'sexualOrientation',
      'description',
      'interests',
      'images',
      'profilePicture',
      'notificationMail',
      'notificationPush',
    ]);
    response.status(200).json(call);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function getUserById(request, response) {
  const id = parseInt(request.params.id, 10);
  try {
    const call = await user.getByFiltered('id', id, [
      'firstname',
      'location', // a voir si on traite avant de l'envoyer
      'birthDate', // a voir si on traite avant de l'envoyer
      'popularityRate',
      'gender',
      'sexualOrientation',
      'description',
      'interests',
      'images',
      'profilePicture',
    ]);
    response.status(200).json(call);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function getUserByUsername(request, response) {
  const { username } = request.params;
  console.log('username', username);
  try {
    const call = await user.getByFiltered('username', username, [
      'id',
      'firstname',
      'username',
      'location',
      'birthDate',
      'popularityRate',
      'gender',
      'sexualOrientation',
      'description',
      'interests',
      'images',
      'profilePicture',
    ]);
    if (call[0] === undefined) {
      return response
        .status(200)
        .json({ success: false, message: "This user doesn't exist." });
    }
    const userIdVisitor = request.decoded.userid;
    const userIdVisited = call[0].id;
    if ((await checkIfProfileCompleted(userIdVisitor)) === false) {
      return response.status(200).json({
        authorized: false,
        message: 'You need to complete your profile first!',
      });
    }
    if (await block.exists(userIdVisited, userIdVisitor)) {
      return response.status(200).json({
        blocked: true,
        message: 'You have been blocked by this user!',
      });
    }
    if (userIdVisitor !== userIdVisited) {
      saveVisit(userIdVisitor, userIdVisited);
      user.updatePopularityRate(userIdVisited);
    }
    const relationship = await like.relationship(userIdVisitor, userIdVisited);
    const userAlreadyBlocked = await block.exists(userIdVisitor, userIdVisited);
    response.status(200).json({
      founded: true,
      ...call[0],
      ...relationship,
      alreadyBlocked: userAlreadyBlocked,
    });
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function usernameExists(request, response) {
  const { username } = request.body;
  if (username === undefined) {
    response.status(206).send('Username is not defined');
    return;
  }
  try {
    const call = await user.exists('username', username);
    response.status(200).json({ exists: call });
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function emailExists(request, response) {
  const { email } = request.body;
  if (email === undefined) {
    response.status(206).send('Email is not defined');
    return;
  }
  try {
    const call = await user.exists('email', email);
    response.status(200).json({ exists: call });
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function createUser(request, response) {
  const { firstname, surname, username, password, email } = request.body;
  const errors = await check.createUserErrors(request.body);

  if (errors.length) {
    response.status(201).json({ errors });
    return;
  }
  try {
    const call = await user.create({
      firstname,
      surname,
      username,
      password,
      email,
    });

    response.status(200).json(call);
    const userId = call.id;
    const { token } = await userValidation.create({
      userId,
      type: 'validationKey',
    });
    await sendSigninEmail(email, firstname, token);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function updateUser(request, response) {
  const id = request.decoded.userid;
  const filteredValues = check.filterInputValues('API', request.body);
  const errors = await check.updateUserErrors(request.body);
  if (errors.length) {
    response.status(201).json({ errors });
    return;
  }
  try {
    await user.updateById(id, filteredValues);
    response.status(200).json({
      success: true,
      message: 'Your information were sucessfully updated',
    });
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function deleteUser(request, response) {
  const id = request.decoded.userid;

  try {
    const imagesToDelete = await user.getByFiltered('id', id, ['images']);
    imagesToDelete[0].images.forEach(imageToDelete =>
      deleteFile(imageToDelete),
    );
    const call = await user.delete(id);
    response.status(200).json(call);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

module.exports.getUsers = getUsers;
module.exports.getUserById = getUserById;
module.exports.getMyUserInfo = getMyUserInfo;
module.exports.usernameExists = usernameExists;
module.exports.emailExists = emailExists;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.getUserByUsername = getUserByUsername;
