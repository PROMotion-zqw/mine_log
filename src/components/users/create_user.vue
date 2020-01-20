<style scoped>
.ivu-input-default {
  font-size: 14px;
}
.create_User {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}
</style>
<template>
  <div class="create_User">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="用户名" prop="name">
        <Input v-model="formValidate.name" placeholder="Enter your name" />
      </FormItem>
      <FormItem label="密码" prop="pass">
        <Input type="password" v-model="formValidate.pass" placeholder="Enter your password" />
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input v-model="formValidate.email" placeholder="Enter your e-mail" />
      </FormItem>
      <FormItem label="手机" prop="phone">
        <Input v-model="formValidate.phone" placeholder="Enter your phone" />
      </FormItem>
      <FormItem label="角色" prop="roles">
        <Select v-model="formValidate.roles" placeholder="Select your roles">
          <Option value="1">超级管理员</Option>
          <Option value="2">普通管理员</Option>
          <Option value="3">商品管理</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          v-enter="[handleSubmit, 'formValidate']"
          @click="handleSubmit('formValidate')"
        >提交</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { log } from "util";
export default {
  directives: {
    enter: {
      componentUpdated(el, bind, vnode) {
        document.onkeydown = function(e) {
          if (e.keyCode === 13) {
            bind.value[0](bind.value[1]);
          }
        };
      }
    }
  },
  data() {
    return {
      formValidate: {
        name: "",
        pass: "",
        email: "",
        phone: "",
        roles: "",
        createTime: null
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        pass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          { type: "email", message: "邮箱格式错误", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        roles: [
          {
            required: true,
            message: "请选择你的角色",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.formValidate.createTime = new Date().getTime();
          this.createUser(this.formValidate);
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    createUser(par) {
      this.$http({
        method: "post",
        url: "/api/create",
        data: par
      })
        .then(res => {
          this.$Message.success("Success!");
          setTimeout(() => {
            this.$emit("createdUser", par.name);
          }, 700);
        })
        .catch(err => {
          if (err.response.data.status === 403) {
            this.$router.push("/login");
            return;
          }
          this.$Message.error("API => '/create' is error");
        });
    }
  }
};
</script>
