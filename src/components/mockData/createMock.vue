<style scoped>
@import "../com_css/createMock.css";
</style>
<template>
  <div class="mock_box">
    <div class="path_add">
      <Card :bordered="true" style="overflow: hidden;padding-bottom: 14px" v-if="add_path.isShow">
        <p slot="title">添加接口 API</p>
        <p>
          <div style="width: 350px">
          <div style="margin-bottom: 4px;font-weight: 600">请求类型</div>
          <CheckboxGroup v-model="addApiBox.type">
            <Checkbox label="GET" border></Checkbox>
            <Checkbox label="POST" border></Checkbox>
            <Checkbox label="DELETE" border></Checkbox>
            <Checkbox label="PUT" border></Checkbox>
          </CheckboxGroup>
          <div style="margin-bottom: 4px;font-weight: 600">URL</div>
            <Input v-model="addApiBox.url" placeholder="create request url" style="width: 300px" />
          <div style="margin-bottom: 4px;font-weight: 600">roles</div>
            <Input v-model="addApiBox.roles" placeholder="roles" style="width: 300px" />
          </div>
        </p>
        <p style="float: right">
          <Button style="margin-right: 10px" @click="addApi('cancel')">取消</Button>
          <Button type="primary" @click="addApi('add')">添加</Button>
        </p>
      </Card>
    </div>
    <!-- api url -->
    <div style="position: relative">
      <Input v-model="url" class="min_stl">
        <Select v-model="types" slot="prepend" style="width: 80px">
          <Option v-for="(mt, current) in metd" :key="current" :value="mt">{{mt}}</Option>
        </Select>
      </Input>
      <Button
        type="primary"
        style="border-radius: 0px 4px 4px 0px;position: absolute;right: 0px;top: 0px;z-index: 2;margin-top: 1px"
        @click="handleRes($event)"
      >Send</Button>
    </div>
    <!-- init data -->
    <div :style="{height: h+'px'}" class="api_info">
      <!-- api path list box -->
      <div class="path_table">
        <ul>
          <li class="path_tools">
            <ul>
              <li class="path_tools_item">
                <Icon type="md-add" @click="handleTools('add')" />
              </li>
              <li class="path_tools_item">
                <Icon type="md-sync" @click="handleTools('clear')" />
              </li>
            </ul>
            <!-- path api list -->
            <ul style="overflow: auto" :style="{height: api_path+'px'}">
              <li
                class="path_api"
                :class="value.selt"
                @click="handleReq($event, key, apiTable)"
                v-for="(value, key) in apiTable"
                :key="key"
              >
                {{value.url}}
                <span class="api_edit">
                  <Icon type="ios-create-outline" />
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- response data -->
      <div :style="{width: api_result+'px'}" class="api_result">
        <ul class="tag_param">
          <li
            :class="[{tag_current: tagItem.isTag}]"
            @click="TagPam(tagIndex, tag_param)"
            v-for="(tagItem, tagIndex) in tag_param"
            :key="tagIndex"
          >{{tagItem.tagTitle}}</li>
        </ul>
        <div ref="ks" class="api_param">
          <!-- type table -->
          <div class="param_header_key">
            <div style="display: block;background-color: #f8f8f9;padding-left: 4px">
              <RadioGroup v-model="dataType" v-if="current_Tags === 0">
                <Radio label="none">
                  <!-- <Icon type="logo-apple"></Icon> -->
                  <span>none</span>
                </Radio>
                <Radio label="form-data">
                  <!-- <Icon type="logo-apple"></Icon> -->
                  <span>form-data</span>
                </Radio>
                <Radio label="x-www-form-urlencoded">
                  <!-- <Icon type="logo-android"></Icon> -->
                  <span>x-www-form-urlencoded</span>
                </Radio>
                <Radio label="raw">
                  <!-- <Icon type="logo-windows"></Icon> -->
                  <span>raw</span>
                </Radio>
              </RadioGroup>
              <span v-if="current_Tags === 0 && isRaw">
                <Select v-model="model2" size="small" style="width:92px">
                  <Option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </span>
              <span
                style="padding: 4px 0px;font-weight: 700;display: inline-block"
                v-if="current_Tags === 1"
              >Headers</span>
              <span
                style="padding: 4px 0px;font-weight: 700;display: inline-block"
                v-if="current_Tags === 2"
              >Query</span>
              <Icon
                size="15"
                @click="clearParam(current_Tags)"
                style="margin-left: 15px"
                type="md-nuclear"
              />
            </div>
            <ul class="labels">
              <li>KEY</li>
              <li>VALUE</li>
            </ul>
          </div>
          <!-- key value -->
          <ul class="text_data">
            <li
              v-if="current_Tags === 2"
              v-for="(paramItem, paramIndex) in Query_list"
              :key="paramIndex"
            >
              <div class="param_keys">
                <Input v-model="paramItem.key" size="small" placeholder="key" />
              </div>
              <div class="param_value">
                <Input v-model="paramItem.value" size="small" placeholder="value" />
              </div>
            </li>
            <li
              v-if="current_Tags === 1"
              v-for="(headerItem, headerInd) in header_list"
              :key="headerInd"
            >
              <div class="param_keys">
                <Input
                  v-model="headerItem.key"
                  size="small"
                  style="font-size: 12px"
                  placeholder="key"
                />
              </div>
              <div class="param_value">
                <Input
                  v-model="headerItem.value"
                  size="small"
                  style="font-size: 12px"
                  placeholder="value"
                />
              </div>
            </li>
            <li
              v-if="current_Tags === 0"
              v-for="(headerItem, headerInd) in param_list"
              :key="headerInd"
            >
              <div class="param_keys">
                <Input v-model="headerItem.key" size="small" placeholder="key" />
              </div>
              <div class="param_value">
                <Input v-model="headerItem.value" size="small" placeholder="value" />
              </div>
            </li>
          </ul>
        </div>
        <div :style="{height: api_w+'px'}" class="api_data" v-html="JsonText"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { log } from "util";
import { keyDowns, Types, deepClone } from "../public_method/index";
export default {
  props: ["screen"],
  data() {
    return {
      addApiBox: {
        type: ["GET"],
        url: "",
        headers: {},
        roles: ""
      },
      flag_H: 0,
      dataType: "",
      h: 545,
      api_w: 0,
      api_path: 0,
      api_result: 0,
      url: "",
      types: "GET",
      isRaw: false,
      cityList: [
        {
          value: "Text",
          label: "Text"
        },
        {
          value: "JavaScript",
          label: "JavaScript"
        },
        {
          value: "JSON",
          label: "JSON"
        },
        {
          value: "HTML",
          label: "HTML"
        },
        {
          value: "XML",
          label: "XML"
        }
      ],
      model2: "Text",
      RawList: {
        Text: "text/plain",
        JavaScript: "application/javascript",
        JSON: "application/json",
        HTML: "text/html",
        XML: "application/xml",
        "x-www-form-urlencoded": "application/x-www-form-urlencoded"
      },
      metd: ["GET", "POST", "DELETE", "PUT"],
      apiTable: null,
      JsonText: "",
      add_path: {
        isShow: false,
        data: null
      },
      tag_param: [
        { tagTitle: "body", isTag: false },
        { tagTitle: "headers", isTag: false },
        { tagTitle: "params", isTag: true }
      ],
      current_Tags: 2,
      param_list: [{ key: "", value: "" }],
      header_list: [{ key: "", value: "" }],
      Query_list: [{ key: "", value: "" }]
    };
  },
  methods: {
    queryParam(n) {
      if (this.url.indexOf("?") !== -1) {
        if (n[n.length - 1].key || n[n.length - 1].value) {
          n.push({ key: "", value: "" });
        }
        if (
          n.every((closeItem, closeIndex) => {
            return !closeItem.key && !closeItem.value;
          })
        ) {
          this.url = this.url.split("?")[0];
        }

        let str = this.url.split("?"),
          strUrl = str[0] + "?";
        n.filter((v, i) => {
          if (i === 0) {
            if (v.key || v.value) {
              this.url = strUrl += v.key + "=" + v.value;
            }
          } else {
            if (!n[i - 1].key && !n[i - 1].value) {
              if (v.key || v.value) {
                this.url = strUrl += v.key + "=" + v.value;
              }
            } else {
              if (v.key || v.value) {
                strUrl = strUrl + "&";
                this.url = strUrl += v.key + "=" + v.value;
              }
            }
          }
        });
      } else {
        this.url = this.url + "?";
        n.filter((newItem, newIndex) => {
          if (newItem.key || newItem.value) {
            this.url += newItem.key + "=" + newItem.value;
          }
        });
        if (n[n.length - 1].key || n[n.length - 1].value) {
          n.push({ key: "", value: "" });
        }
      }
    },
    handleKeyVal(e) {
      console.log("handleKeyVal", e.target.value);
    },
    handleTools(str) {
      switch (str) {
        case "add":
          console.log("add....");
          this.add_path.isShow = true;
          break;
        case "clear":
          console.log("clear....");
          this.getApiTable();
          break;
      }
    },
    getApiTable() {
      this.$http({
        url: "/api/api_table",
        method: "get"
      })
        .then(res => {
          Object.keys(res.data).filter((v, i) => {
            res.data[v].selt = "";
          });
          this.apiTable = res.data;
        })
        .catch(err => {
          if (err.response.data.status === 403) {
            this.$router.push("/login");
            return;
          }
          this.apiTable = [];
        });
    },
    handleReq(e, n, o) {
      Object.keys(o).filter((v, i) => {
        if (v === n) {
          o[v].selt = "rq_current";
          this.url = o[v].url;
        } else {
          o[v].selt = "";
        }
      });
    },
    parData(n) {
      try {
        let rt = JSON.parse(n);
        return rt;
      } catch (err) {
        return n;
      }
    },
    handleRes(e) {
      if (this.url) {
        let head = {
          url: this.url,
          method: this.types
        };
        if (
          !this.header_list.every(
            (headI, headInd) => !headI.key && !headInd.value
          )
        ) {
          head.headers = this.headerParam(this.header_list);
        }

        // POST
        if (this.types === "POST") {
          if (
            !this.param_list.every(
              (bodData, bodInd) => !bodData.key && !bodData.value
            )
          ) {
            head.data = this.headerParam(this.param_list);
            if (this.dataType === "form-data") {
              let newFormData = new FormData();
              Object.keys(head.data).filter((streamItem, streamIndex) => {
                newFormData.append(streamItem, head.data[streamItem]);
              });
              head.data = newFormData;
              console.log("form-data", newFormData.get("name"));
            }
            Object.keys(head.data).filter((parItem, parIndex) => {
              head.data[parItem] = this.parData(head.data[parItem]);
            });
          }
        }
        console.log("heads", head);
        // return;
        this.$http(head)
          .then(res => {
            // console.log("res", res);
            this.JsonText = JSON.stringify(res.data, null, 4)
              .replace(/^/gm, "<p>")
              .replace(/$/gm, "</p>");
          })
          .catch(err => {
            if (err.response.data.status === 403) {
              this.$router.push("/login");
              return;
            }
            this.JsonText = JSON.stringify(err.response.data, null, 4)
              .replace(/^/gm, "<p>")
              .replace(/$/gm, "</p>");
            // this.JsonText = err.response.data;
          });
      } else {
        this.JsonText ? (this.JsonText = "") : null;
      }
    },
    TagPam(index, n) {
      n.filter((v, i) => {
        if (i === 0) {
          this.watchDataType(this.dataType);
        }
        if (index === i) {
          this.current_Tags = i;
          v.isTag = true;
        } else {
          v.isTag = false;
        }
      });
    },
    headerParam(arr, str) {
      if (str && Types(arr) === "Array") {
        alert('POST data type is "Array"');
        return;
      }
      let headers = {};
      arr.filter((v, i) => {
        v.key ? (headers[v.key] = v.value) : null;
      });
      return headers;
    },
    addApi(str) {
      if(str === "add") {
        let dataBody = JSON.parse(JSON.stringify(this.addApiBox))
        dataBody.roles = Number(dataBody.roles);
        // this.addApiBox.type = [];
        // this.addApiBox = deepClone({data: this.addApiBox, model: "empty"});
        this.$http({
          url: "/api/create_api",
          method: "post",
          data: dataBody
        }).then(res => {
          this.$Message.error("添加成功");
          this.addApiBox.type = [];
          this.addApiBox = deepClone({data: this.addApiBox, model: "empty"});
          this.add_path.isShow = false;
          this.getApiTable();
        }).catch(err => {
          this.$Message.error("添加失败");
          this.add_path.isShow = false;
        })
      }else {
          this.add_path.isShow = false;
      }
      // this.add_path.isShow = false;
    },
    defaultHeaderAppend(n) {
      let content = false,
        keyText = Object.keys(n)[0];
      this.header_list.filter((v, i) => {
        if (v.key === keyText) {
          !content ? ((v.value = n[v.key]), (content = true)) : null;
        } else if (!v.key) {
          !content
            ? ((v.key = keyText), (v.value = n[keyText]), (content = true))
            : null;
        }
      });
    },
    watchDataType(n) {
      switch (n) {
        case "none":
          this.header_list = [{ key: "", value: "" }];
          break;
        case "form-data":
          break;
        case "x-www-form-urlencoded":
          this.defaultHeaderAppend({
            "Content-Type": this.RawList[n]
          });
          break;
        case "raw":
          this.isRaw = true;
          this.defaultHeaderAppend({
            "Content-Type": this.RawList[this.model2]
          });
          break;
      }
    },
    clearParam(n) {
      switch (n) {
        case 0:
          this.param_list = [{ key: "", value: "" }];
          break;
        case 1:
          this.header_list = [{ key: "", value: "" }];
          break;
        case 2:
          this.Query_list = [{ key: "", value: "" }];
          break;
      }
    }
  },
  mounted() {
    this.api_result = this.screen.w - 682;
    this.api_path = this.screen.h - 202;
    this.api_w = this.screen.h - 504;
    this.h = this.screen.h - 178;
    keyDowns(e => {
      if (e.keyCode === 13) {
        if (this.url) {
          this.handleRes();
        }
      }
    });
  },
  created() {
    this.getApiTable();
  },
  watch: {
    Query_list: {
      handler(n) {
        let urr = [this.url, ""];
        this.queryParam(n);
      },
      deep: true
    },
    param_list: {
      handler(n) {
        if (n[n.length - 1].key || n[n.length - 1].value) {
          n.push({ key: "", value: "" });
        }
      },
      deep: true
    },
    header_list: {
      handler(n) {
        if (n[n.length - 1].key || n[n.length - 1].value) {
          n.push({ key: "", value: "" });
        }
      },
      deep: true
    },
    screen: {
      handler(n) {
        this.api_result = n.w - 682;
        this.api_path = n.h - 202;
        this.api_w = n.h - 504;
        this.h = n.h - 178;
        if (this.flag_H === n.h) return;
      },
      deep: true
    },
    dataType: function(n) {
      console.log("data y", n);

      this.isRaw = false;
      this.watchDataType(n);
    },
    model2: function(n) {
      this.defaultHeaderAppend({
        "Content-Type": this.RawList[n]
      });
    }
  }
};
</script>