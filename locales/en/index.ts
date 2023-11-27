import auth from "./auth";
import sidebar from "./sidebar";
import success from "./success";
import error from "./error";
import home from "./home";
import notification from "./notification";
import bookmark from "./bookmark";
import newpost from "./newpost";

export default {
  auth,
  sidebar,
  success,
  error,
  searchbar: "Search",
  home,
  notification,
  bookmark,
  newpost,
} as const;
