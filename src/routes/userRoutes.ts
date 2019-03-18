import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const userController: UserController = new UserController();

userRouter.route("/users")
  .get(userController.getUsers)
  .post(userController.addUser);

userRouter.route("/users/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
