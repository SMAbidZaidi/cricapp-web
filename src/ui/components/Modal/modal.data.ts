import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import SessionExpiredModal from "./SessionExpiredModal";
import { ModalData } from "./types";

export const modalsData: ModalData[] = [
  { name: "login", title: "Login", component: Login },
  { name: "signup", title: "signup", component: SignUp },
  { name: "session-expired", title: "Session Expired", component: SessionExpiredModal },
] as const;
