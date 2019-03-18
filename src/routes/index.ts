import UserRoutes from "./userRoutes";

const allRoutes = [
  UserRoutes
];

export class AppRoutes {
  public set(app): void {
    // all v1 api
    app.use("/v1/api", allRoutes);
  }
}
