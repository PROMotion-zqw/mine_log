<style scoped>
    .loginBox {
        position: absolute;
        top: 145px;
        /* left: 50%;
        top: 50%;
        transform: translate(-50%); */
        width: 300px;
        box-shadow: 0px 0px 1px #6f6767;
    }
    .icons {
      position: absolute;
      left: 50%;
      top: 15%;
      transform: translate(-50%);
    }
    .loginBox::before {
      content: "";
      display: block;
      height: 150px;
      width: 100px;
      background: url(../../assets/logIcon.png);
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
    }
    .CardBoxs {
      position: absolute;
      height: 490px;
      width: 308px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
    }
</style>
<template>
  <div style="height: 100%; background: #f5f7f2;position: relative">
    <div class="CardBoxs">
          <Card class="loginBox" :bordered="false">
      <p slot="title">登录</p>
      <p>
      <Form ref="formInline" :model="formInline">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
          <FormItem prop="auth">
              <Row>
                  <Col span="10">
                      <Input type="text" v-model="formInline.auth" placeholder="auth" />
                  </Col>
                  <Col span="14">
                    <div @click="changeSvg" v-html="authImg"></div>
                  </Col>
              </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
        </FormItem>
      </Form>
      </p>
    </Card>
    </div>
    <footers />
  </div>
</template>
<script>
import {isEmpty, keyDowns} from "../public_method"
import { log } from 'util';
import footers from "../footer";

export default {
  directives: {

  },
  components: {
    footers
  },
  data() {
    return {
      modal1: true,
      authImg: null,
      formInline: {
        user: "",
        password: "",
        auth: ""
      }
    };
  },
  created() {
      this.getAuthSvg()
  },
  mounted() {
    keyDowns((e) => {
      // console.log('key', e.keyCode);
      if(e.keyCode === 13) {
        this.handleSubmit('formInline')
      }
    })
  },
  methods: {
    changeSvg() {
      this.getAuthSvg()
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
          let msg = isEmpty(this.formInline)
          if(msg) {
              this.$Message.error(msg);
              return
          }
          let {user, password, auth} = this.formInline
          this.loginEnter({
              name: user,
              pass: password,
              auth: auth
          })
      });
    },
    getAuthSvg() {
        this.$http({
            method: "get",
            url: "/api/login"
        }).then(res => {
            this.authImg = res.data.img
        }).catch(err => {
            this.$Message.error("验证码错误")
        })
    },
    loginEnter(par) {
        this.$http({
            method: "post",
            url: "/api/login",
            data: par
        }).then(res => {
			// console.log('login OK', res);
            if(res.data.ok) {
              localStorage.setItem("ins", JSON.stringify(res.data.data))
              this.$router.push("/")
            }
        }).catch(err => {
            this.$Message.error({
                content: err.response.data.msg,
                top: 100
            });
            this.getAuthSvg()
        })
    }
  }
};
</script>
