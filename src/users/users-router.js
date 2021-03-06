const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { email, password } = req.body;
  const newUserData = { email, password };

  for (const [key, value] of Object.entries(newUserData))
    if (value == null)
      return res
        .status(400)
        .json({ error: `Missing '${key}' in request body` });

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.userAllowed(req.app.get('db'), email)
    .then(userAllowed => {
      if (!userAllowed)
        return res
          .status(400)
          .json({ error: `Email provided is not allowed to register` });

      UsersService.hasUserWithEmail(req.app.get('db'), email)
        .then(hasUserWithEmail => {
          if (hasUserWithEmail)
            return res.status(400).json({ error: 'Email already registered' });

          return UsersService.hashPassword(password).then(hashedPassword => {
            const newUser = {
              email,
              password: hashedPassword
            };

            return UsersService.insertUser(req.app.get('db'), newUser).then(
              user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              }
            );
          });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = usersRouter;
