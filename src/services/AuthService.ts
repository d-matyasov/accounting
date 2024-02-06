import apiClient from "axios"; // apiClient is an axios instance
import router from "@/router";
import axios from "axios";

class AuthService {
  login = async (user: any): Promise<any> => {
    return await axios.post("/api/auth/authenticate", {
      login: user.login,
      password: user.password,
    });
  };
  logout() {
    window.localStorage.removeItem("jwtToken");
    router.push("/auth/login");
  }
}
export default new AuthService();