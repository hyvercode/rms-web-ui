<template>
  <div class="body">
    <main class="d-flex align-items-center min-vh-100 py-md-0">
      <div class="container">
        <div class="card login-card d-flex">
          <div class="card-body text-center">
            <div class="text-center">
              <router-link
                  to="/"
              >
                <img src="~@/assets/images/icons/brand.png" width="200" class="mb-3"/>
              </router-link>
              <p class="login-card-description h6">Forgot Password</p>
              <h6 class="m-3">
                Please input your mail or phone number
              </h6>
            </div>
            <form role="form" @submit.prevent="onSubmit">
              <div class="form-group">
                <div class="col-4">
                  <em>
                    <img
                        src="~@/assets/images/icons/mail.png"
                        style="position: absolute; margin: 8px 0px 8px -110px"
                    />
                  </em>
                </div>
                <div class="col-12">
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="username"
                      placeholder="person@example.com"
                      required
                  />
                </div>
              </div>
              <div class="container mt-4">
                <input
                    class="btn btn-block login-btn"
                    type="submit"
                    value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
        <autor />
      </div>
    </main>
  </div>
</template>
<script>
import router from "@/router";
import pages from "../../helpers/Pages";
import Autor from "../navigation/Autor";

export default {
  name: "ForgotPassword",
  components: {Autor},
  data() {
    return {
      username: "",
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      let loading = this.$loading.show();
      this.$store.dispatch("auth/otp", this.username).then(
          (response) => {
            loading.hide();
            sessionStorage.setItem("session_id", response.data.id);
            sessionStorage.setItem("session_username", this.username);
            router.push(pages.PASSWORD_OTP);
          },
          (error) => {
            loading.hide();
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: error.response.data.message,
            });
          }
      );
    },
  }
};
</script>

<style scoped>
.body {
  /*background: linear-gradient(180deg, #4790d9 50%, #074887 100%) !important;*/
  min-height: 10vh;
}

.card {
  max-width: 550px;
  margin: auto;
}

.login-card {
  border: 0;
  border-radius: 27.5px;
  box-shadow: 0 10px 30px 0 rgba(172, 168, 168, 0.43);
  overflow: hidden;
}

.login-card .card-body {
  padding: 50px 60px 60px;
}

@media (max-width: 422px) {
  .login-card .card-body {
    padding: 35px 24px;
  }
}

.login-card-description {
  font-size: 30px;
  color: #444444;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 23px;
}

.login-card form {
  max-width: 400px;
  margin: auto;
}

.login-card .form-control {
  border: 1px solid #4b4c4d;
  padding: 15px 25px;
  font-size: 18px;
  height: 50px;
  font-weight: 600;
  line-height: 15;
}

.login-card .form-control::-webkit-input-placeholder {
  color: #919aa3;
}

.login-card .form-control::-moz-placeholder {
  color: #919aa3;
}

.login-card .form-control:-ms-input-placeholder {
  color: #919aa3;
}

.login-card .form-control::-ms-input-placeholder {
  color: #919aa3;
}

.login-card .form-control::placeholder {
  color: #919aa3;
}

.login-card .login-btn {
  background: linear-gradient(180deg, #4790d9 10%, #054686 100%);
  border-radius: 12px;
  border: none;
  font-size: 17px;
  line-height: 30px;
  color: #fff;
  margin-bottom: 24px;
}

.login-card .login-btn:hover {
  border: none;
  background-color: transparent;
  color: linear-gradient(180deg, #074887 0%, #074887 10%);
}

</style>
