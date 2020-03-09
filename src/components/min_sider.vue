
<style scoped>
.f_sider {
  /* max-width: 240px;
  min-width: 240px; */
  float: left;
  z-index: 1;
  height: 100%;
  padding-bottom: 78px;
  position: relative;
  transition: all 0.4s;
}
.drags {
  position: absolute;
  right: -17px;
  /* color: #7d7979; */
  top: 0px;
  text-align: center;
  z-index: 900;
  width: 17px;
  background-color: #f6efef;
  border: 1px solid #e9e2e2;
  font-size: 10px;
}
.siderHide {
  position: absolute;
  bottom: 48px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  z-index: 900;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  text-align: center;
}
.Sider_uls::-webkit-scrollbar {
  width: 6px;
}
.Sider_uls::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 100px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
/* .drags:hover {
  background-color: #a8bbf4;
} */
</style>
<template>
  <div ref="siderItem" :style="{width: dragWidth+'px'}" class="f_sider">
    <Menu
      v-if="listShow"
      @on-open-change="handleOpen"
      @on-select="handleSelect"
      :active-name="action_names"
      :open-names="[Menu_index]"
      class="Sider_uls"
      style="width: 100%; overflow-y: auto"
    >
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-people" />用户管理
        </template>
        <MenuItem ref="newUser" name="1-1">用户列表</MenuItem>
        <MenuItem name="1-2">新增用户</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="md-build" />工具
        </template>
        <MenuItem name="2-1">mockTools</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="md-document" />文档
        </template>
        <MenuItem name="3-1">API</MenuItem>
      </Submenu>
      <Submenu name="4">
        <template slot="title">
          <Icon type="ios-book" />Words
        </template>
        <MenuItem name="4-1">单词本</MenuItem>
      </Submenu>
      <MenuItem name>
        <Icon size="20" type="md-log-out" />退出
      </MenuItem>
    </Menu>
    <span
      :style="{height: dragBox+'px', lineHeight: dragBox+'px', cursor: listShow ? 'ew-resize' : 'pointer'}"
      @mousedown="handleDrag($event)"
      class="drags"
    >|||</span>
    <div @click="handleHide" class="siderHide">
      <Icon v-if="listShow" size="20" type="ios-arrow-back" />
    </div>
  </div>
</template>

<script>
import { MonitorSize } from "./public_method/index";
import { format } from "path";
export default {
  props: ["screen", "action_index", "autoToggle"],
  data() {
    return {
      isCollapsed: false,
      dragBox: 0,
      dragWidth: 240,
      listShow: true,
      Menu_index: "1",
      action_names: ""
    };
  },
  methods: {
    handleHide() {
      if (this.listShow) {
        this.listShow = false;
        this.dragWidth = 0;
      }
    },
    handleDrag(e) {
      if (!this.listShow) {
        this.dragWidth = 240;
        setTimeout(() => {
          this.listShow = true;
        }, 200);
      } else {
        this.$refs.siderItem.style.transition = "none";
        e.preventDefault();
        document.onmousemove = this.handleDragMove;
        document.onmouseup = this.handleDragUp;
      }
    },
    handleDragUp(e) {
      document.onmousemove = null;
      document.onmouseup = null;
      this.$refs.siderItem.style.transition = "all .4s";
    },
    handleDragMove(e) {
      if (e.clientX < 240) {
        this.dragWidth = 240;
        return;
      }
      if (e.clientX > 380) {
        this.dragWidth = 380;
        return;
      }
      this.dragWidth = e.clientX;
    },
    handleOpen(v) {},
    handleSelect(v) {
      if (v) {
        this.$emit("chageSider", v);
      } else {
        this.Logout();
      }
    },
    Logout() {
      this.$http({
        url: "/api/Logout",
        method: "get"
      })
        .then(res => {
          // console.log("logout", res.data);
          setTimeout(() => {
            this.$router.push("/login");
          }, 500);
        })
        .catch(err => {
          this.$Message.error("退出失败");
        });
    }
  },
  mounted() {},
  created() {
    this.action_names = this.action_index;
  },
  watch: {
    screen: {
      handler(n) {
        this.dragBox = n.h - 48;
      },
      deep: true
    },
    listShow: function(n) {
      if (n) {
        this.action_names = this.action_index;
        this.Menu_index = this.action_index.split("-")[0];
      }
    },
    autoToggle: function(n) {
      if (n) {
        if ("newUser" in this.$refs) {
          this.$refs.newUser.$el.click();
        }
      }
    }
  }
};
</script>