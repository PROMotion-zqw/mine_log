<style>
.Sider_uls {
  height: 100%;
}
.content_text {
  overflow: hidden;
  /* width: 85%; */
  /* padding: 40px; */
  height: 100%;
  padding-bottom: 48px;
  /* float: left; */
  /* overflow: auto; */
}
.item_content {
  overflow: auto;
  height: 100%;
  position: relative;
  padding-top: 40px;
}
.lef {
  height: 100%;
  width: 100px;
  float: left;
  background-color: orange;
}
.rig {
  height: 100%;
  overflow: hidden;
  background-color: skyblue;
}
.fls2 {
  height: 100%;
}
</style>
<template>
  <div style="height: 100%">
    <div class="fls2">
      <!-- 左侧 侧边栏 -->
      <min-sider :screen="layer" :action_index="change_Item" @chageSider="handleSider" />
      <!-- 右侧内容 -->
      <div class="content_text">
        <div class="item_content item_users" v-if="change_Item === '1-1'">
          <user-list :screen="layer" />
        </div>
        <div class="item_content" v-if="change_Item === '1-2'">
          <create-user :screen="layer" @createdUser="handleAddUser" />
        </div>
        <div class="item_content" style="height: 100%" v-if="change_Item === '2-1'">
          <mock-rq :screen="layer" />
        </div>
        <div class="item_content" style="height: 100%" v-if="change_Item === '3-1'">
          <api-table />
        </div>
      </div>
      <footers />
    </div>
  </div>
</template>
<script>
import { MonitorSize } from "../components/public_method/index";
import userList from "../components/users/user_list";
import createUser from "../components/users/create_user";
import footers from "../components/footer";
import minSider from "../components/min_sider";
import mockRq from "../components/mockData/createMock";
import apiTable from '../components/docApi/list_docApi'
export default {
  data() {
    return {
      change_Menu: null,
      change_Item: "1-1",
      layer: {
        w: null,
        h: null
      }
    };
  },
  components: {
    userList,
    createUser,
    footers,
    minSider,
    mockRq,
    apiTable
  },
  methods: {
    handleSider(v) {
      this.change_Item = v;
    },
    handleAddUser() {
      this.change_Item = "1-1";
    },
    getAddApi() {
      var forms = new FormData();
      forms.append("sid", "sdfsferg345grff");
      this.$http({
        url: "/api/multer",
        method: "post",
        data: forms,
        // headers: {
        //   "Content-Type": "multipart/form-data"
        // }
      })
        .then(res => {
          console.log("multer", res);
        })
        .catch(err => {
          console.log("multer err", err);
        });
    }
  },
  mounted() {
    MonitorSize((w, h) => {
      this.layer.w = w;
      this.layer.h = h;
    });
  },
  created() {
    this.getAddApi();
  }
};
</script>
