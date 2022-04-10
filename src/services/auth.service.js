import Host from "@/api/host";
import router from "../router/index";
import Api from "../api/Api";
import VueCookies from "vue-cookies";
import Pages from "../helpers/Pages";

class AuthService {
    login(user) {
        return Api.doPostOut(Host.API_V1 + "/auth/login", user).then((response) => {
            VueCookies.set(
                "__MIH__BASE__SESSIONID__",
                JSON.stringify(response),
                "7d",
                "/",
                "",
                true,
                "Strict"
            );
            return response;
        });
    }

    logout() {
        VueCookies.remove("__MIH__BASE__SESSIONID__");
        location.reload();
        return Api.doPostOut(Host.API_V1 + "/auth/logout", "").then(
            () => {
                VueCookies.remove("__MIH__BASE__SESSIONID__");
                router.push(Pages.LOGIN);
                location.reload();
            },
            () => {
                VueCookies.remove("__MIH__BASE__SESSIONID__");
                router.push(Pages.LOGIN);
                location.reload();
            }
        );
    }

    refreshToken() {
        return Api.doPost(Host.API_V1 + "/auth/refresh", "").then(
            (response) => {
                if (response.code === 200 && response.accessToken) {
                    VueCookies.set(
                        "__MIH__BASE__SESSIONID__",
                        JSON.stringify(response),
                        Math.floor(response.expires_in / 1440) + "d",
                        "/",
                        "",
                        true,
                        "Strict"
                    );
                }
                return response.data;
            },
            () => {
                this.logout().then(() => {
                    router.push(Pages.LOGIN);
                });
            }
        );
    }

    postVerifikaiOtp(username) {
        return Api.doGet(Host.API_V1 + "/otp/" + username);
    }

    RefreshOtp(username) {
        return Api.doPost(Host.API_V1 + "/password/generate", {
            username: username,
        });
    }

    postverified(params) {
        return Api.doPost(Host.API_V1 + "/otp/verified", params);
    }

    resetPassword(params) {
        return Api.doPost(Host.API_V1 + "/otp/changePassword", params);
    }
}

export default new AuthService();
