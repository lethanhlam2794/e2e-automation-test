import { ProjectLoginCapabilities } from "../../types/login.type";
import { LoginPage } from "../../pages/LoginPage";
import { ILoginFlow } from "./ILoginFlow";
import { StandardLoginFlow } from "./StandardLoginFlow";
import { LOGIN_FLOW } from "../../constants/constants";

export function createLoginFlow(
  config: ProjectLoginCapabilities,
  loginPage: LoginPage
): ILoginFlow {
  switch (config.loginFlow) {
    case LOGIN_FLOW.STANDARD:
      return new StandardLoginFlow(loginPage);
    default:
      throw new Error(`Invalid login flow: ${config.loginFlow}`);
  }
}