import { NextFunction, Request, Response } from "express";

import User from "../models/user";
import { UserType } from "../models/user";
import logger from "../utils/logger";
import MailService from "../utils/mail";

const mailService = new MailService();

export class UserController {

  /**
   * Add new user
   *
   * @class UserController
   * @method post
   * @param request {Request} The express request object.
   * @param response {Response} The express response object.
   *
   *
   * @api {post} /users/ Add new User
   * @apiVersion 1.0.0
   * @apiName addUser
   * @apiGroup User
   *
   * @apiParam {String} name User full name
   * @apiParam {String} email User email
   * @apiParam {String} phone User phone number
   *
   * @apiSuccess {String} _id unique id of the User.
   * @apiSuccess {String} name  Name of the User.
   * @apiSuccess {String} email  email of the User.
   * @apiSuccess {String} createdAt  createdAt time of user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "5c8f29852253e53af4a0f276",
   *       "name": "Jhon Doe",
   *       "phone": "019183434344",
   *       "email": "jhon@doe.com",
   *       "createdAt": "2019-03-18T05:15:49.715Z",
   *     }
   *
   * @apiError ValidationError User input validation error
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *      "errors": {
   *         "email": {
   *           "message": "Invalid Email",
   *           "name": "ValidatorError",
   *           "properties": {
   *             "message": "Invalid Email",
   *             "type": "user defined",
   *             "path": "email",
   *             "value": "DFDFD@ddd"
   *           },
   *           "kind": "user defined",
   *           "path": "email",
   *           "value": "DFDFD@ddd"
   *         }
   *       },
   *       "_message": "User validation failed",
   *       "message": "User validation failed: email: Invalid Email",
   *       "name": "ValidationError"
   *     }
   */
  public async addUser(request: Request, response: Response) {
    const newUser = new User(request.body);
    try {
      const user: UserType = await newUser.save();
      if (user) {
        // const msg = {
        //   to: user.email,
        //   from: process.env.GMAIL_USER,
        //   subject: "New user Created",
        //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        // };
        // // send email
        // const mail = await mailService.send(msg);
        const mail = true;
        if (mail) {
          response.status(201).json(user);
        }
      }
    } catch (error) {
      logger.error(error.toString());
      response.status(400).json(error);
    }
  }

  /**
   * get all users
   *
   * @class UserController
   * @method get
   * @param request {Request} The express request object.
   * @param response {Response} The express response object.
   *
   *
   * @api {get} /users/ Request all users
   * @apiVersion 1.0.0
   * @apiName getUsers
   * @apiGroup User
   *
   *
   * @apiSuccess {String} _id unique id of the User.
   * @apiSuccess {String} name  Name of the User.
   * @apiSuccess {String} email  email of the User.
   * @apiSuccess {String} createdAt  createdAt time of user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{
   *       "_id": "5c8f29852253e53af4a0f276",
   *       "name": "Jhon Doe",
   *       "phone": "019183434344",
   *       "email": "jhon@doe.com",
   *       "createdAt": "2019-03-18T05:15:49.715Z",
   *     },{
   *       "_id": "5c8f29852253e53af4a0f276",
   *       "name": "Jhon Doe",
   *       "phone": "019183434344",
   *       "email": "jhon@doe.com",
   *       "createdAt": "2019-03-18T05:15:49.715Z",
   *     }]
   */
  public async getUsers(request: Request, response: Response) {
    try {
      const users: [UserType] = await User.find();
      response.status(200).json(users);
    } catch (error) {
      logger.error(error.toString());
      response.status(400).json(error);
    }
  }

  /**
   * Get a user
   *
   * @class UserController
   * @method get
   * @param request {Request} The express request object.
   * @param response {Response} The express response object.
   *
   *
   * @api {get} /users/:id Request single user
   * @apiVersion 1.0.0
   * @apiName getUser
   * @apiGroup User
   *
   * @apiParam {String} id User id
   *
   * @apiSuccess {String} _id unique id of the User.
   * @apiSuccess {String} name  Name of the User.
   * @apiSuccess {String} email  email of the User.
   * @apiSuccess {String} createdAt  createdAt time of user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "5c8f29852253e53af4a0f276",
   *       "name": "Jhon Doe",
   *       "phone": "019183434344",
   *       "email": "jhon@doe.com",
   *       "createdAt": "2019-03-18T05:15:49.715Z",
   *     }
   *
   * @apiError UserNotFound The id of the User was not found.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *      "message": "User not found",
   *       "name": "UserNotFound"
   *     }
   */
  public async getUser(request: Request, response: Response) {

    try {
      const user: UserType = await User.findById(request.params.id);
      if (!user) {
        const message = {
          message: "User not found",
          name: "UserNotFound"
        };
        response.status(404).json(message);
      } else {
        response.status(200).json(user);
      }
    } catch (error) {
      logger.error(error.toString());
      response.status(400).json(error);
    }
  }

  /**
   * Update a user
   *
   * @class UserController
   * @method put
   * @param request {Request} The express request object.
   * @param response {Response} The express response object.
   *
   *
   * @api {get} /users/:id Update a user
   * @apiVersion 1.0.0
   * @apiName updateUser
   * @apiGroup User
   *
   * @apiParam {String} id User id
   *
   * @apiParam {String} name User full name
   * @apiParam {String} email User email
   * @apiParam {String} phone User phone number
   *
   * @apiSuccess {String} _id unique id of the User.
   * @apiSuccess {String} name  Name of the User.
   * @apiSuccess {String} email  email of the User.
   * @apiSuccess {String} createdAt  createdAt time of user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "5c8f29852253e53af4a0f276",
   *       "name": "Jhon Doe",
   *       "phone": "019183434344",
   *       "email": "jhon@doe.com",
   *       "createdAt": "2019-03-18T05:15:49.715Z",
   *     }
   *
   * @apiError UserNotFound The id of the User was not found.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *      "message": "User not found",
   *       "name": "UserNotFound"
   *     }
   */
  public async updateUser(request: Request, response: Response) {

    try {
      const user: UserType = await User.findOneAndReplace({ _id: request.params.id }, request.body);
      if (!user) {
        const message = {
          message: "User not found",
          name: "UserNotFound"
        };
        response.status(404).json(message);
      } else {
        response.status(201).json(user);
      }

    } catch (error) {
      logger.error(error.toString());
      response.status(400).json(error);
    }
  }

  /**
   * Delete a user
   *
   * @class UserController
   * @method delete
   * @param request {Request} The express request object.
   * @param response {Response} The express response object.
   *
   *
   * @api {get} /users/:id Delete a user
   * @apiVersion 1.0.0
   * @apiName deleteUser
   * @apiGroup User
   *
   * @apiParam {String} id User id
   *
   *
   */
  public async deleteUser(request: Request, response: Response) {
    try {
      const user = await User.deleteOne({ _id: request.params.id });
      const message = {
        message: "User deleted successfully",
        name: "UserDeleted"
      };
      response.status(204).json(message);

    } catch (error) {
      logger.error(error.toString());
      response.status(400).json(error);
    }

  }
}
