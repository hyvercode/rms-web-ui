import VueCookies from "vue-cookies";

export default function authHeader() {
    let auth = JSON.parse(JSON.stringify(VueCookies.get('__MIH__BASE__SESSIONID__')));
    if (auth) {
        return {
            'Authorization': 'Bearer ' + auth.accessToken,
            'Content-Type': 'application/json'
        };
    } else {
        return {};
    }
}