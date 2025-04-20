import auth_route from "./auth.route.js";
import user_route from "./user.route.js";
import message_route from "./message.route.js";

const MountRoute = (app) => {
  app.use("/api/auth", auth_route);
  app.use("/api/users", user_route);
  app.use("/api/messages", message_route);
};

export default MountRoute;
