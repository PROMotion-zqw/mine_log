<style scoped>
.pas {
  margin-top: 10px;
}
.user_box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}
</style>
<template>
  <div class="user_box">
    <Modal
      @on-ok="handleColse('ok')"
      @on-cancel="handleColse('cancel')"
      v-model="rm_modal.modal"
      :styles="{top: '20px'}"
    >
      <p slot="header" style="color:red">
        <span>Delete</span>
      </p>
      <p>{{rm_modal.data ? "确定删除 \""+rm_modal.data.name+"\" 用户吗" : ''}}</p>
    </Modal>
    <div>
      <Table border :columns="columns12" :data="data6"></Table>
      <Page
        @on-change="changePage"
        class="pas"
        :current="pages"
        :page-size="page_size"
        :total="totals"
        simple
      />
    </div>
  </div>
</template>
<script>
import { log } from "util";
export default {
  data() {
    return {
      rm_modal: {
        modal: false,
        data: null,
        num: null
      },
      columns12: [
        {
          title: "用户",
          key: "name",
          render: function(h, param) {
            return h("strong", {}, param.row.name);
          }
        },
        {
          title: "手机",
          key: "phone"
        },
        {
          title: "邮件",
          key: "email"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, param) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.rm_modal.num = param.index;
                      this.rm_modal.data = param.row;
                      this.rm_modal.modal = true;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data6: [],
      totals: 0,
      pages: 1,
      page_size: 10
    };
  },
  created() {
    this.getUserList({ page: this.pages, pageSize: this.page_size });
  },
  methods: {
    handleColse(v) {
      if (v === "ok") {
        this.remove(this.rm_modal.num, this.rm_modal.data);
      }
    },
    getUserList(opt) {
      this.$http({
        method: "get",
        url: "/api/getUser?page=" + opt.page + "&pageSize=" + opt.pageSize
      })
        .then(res => {
          this.totals = res.data.total;
          this.data6 = [];
          res.data.data.filter((v, i) => {
            this.data6.push(v);
          });
        })
        .catch(err => {
          console.log("getUser err", [err]);
          if (err.response.data.status === 403) {
            this.$router.push("/login");
            return;
          }
          this.data6 = [];
        });
    },
    delUser(str) {
      this.$http({
        method: "delete",
        url: "/api/delUser?name=" + str
      })
        .then(res => {
          this.$Message.success(`"${str}"用户 删除成功`);
          this.getUserList({ page: this.pages, pageSize: this.page_size });
        })
        .catch(err => {
          if (err.response.data.status === 403) {
            this.$router.push("/login");
            return;
          }
          this.$Message.error({
            content: err.response.data.msg,
            top: 100
          });
        });
    },
    show(index) {
      // this.$Modal.info({
      //   title: "User Info",
      //   content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].phone}<br>Address：${this.data6[index].email}`
      // });
    },
    remove(index, row) {
      this.delUser(row.name);
    },
    changePage(v) {
      this.pages = v;
      this.getUserList({ page: v, pageSize: this.page_size });
    }
  },
  watch: {
    rm_modal: {
      handler(n) {},
      deep: true
    }
  }
};
</script>