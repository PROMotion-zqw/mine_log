<style scoped>
.word_list {
  width: 90%;
  min-width: 587px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0px 0px 4px #d5d0d0;
  margin-bottom: 20px;
}
.main_list {
  position: relative;
  padding-top: 10px;
}
.toogle_mode {
  margin-right: 8px;
}
.mine_input {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  /* padding-bottom: 2px; */
  border-bottom: 2px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
  outline: none;
}
.word_text {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}
.word_iput {
  text-align: center;
}
.next_icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.total_length {
  position: absolute;
  right: 16px;
  font-size: 16px;
}
.word_item_box {
  width: 50%;
  float: left;
  padding: 5px 0px;
  padding-left: 4px;
  position: relative;
  cursor: default;
}
.action_edit {
  /* float: right; */
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 10px;
  text-align: center;
  width: 38px;
  font-size: 14px;
  background: green;
  border-radius: 4px;
  color: white;
  display: none;
}
.Item_List {
  display: flex;
  flex-direction: column;
}
.word_ps {
  font-size: 17px;
  color: #5b5050;
  line-height: 44px;
}
.word_Big_Title {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-bottom: 12px;
}
.word_cns {
  width: 100%;
  padding: 4px 0px;
}
.SearchInt {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
}
.word_tips {
  right: 8px;
  position: absolute;
}
.fail {
  background-color: #e13030;
  color: white;
}
.right {
  background-color: #eaeeef;
  color: #2c3e50;
}
.spells {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
}
.updateWordBox {
  position: fixed;
  width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: #f2fdf3;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0px;
}
.cover {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 1;
  height: 100%;
  background-color: grey;
}
.title_Left {
  font-size: 16px;
}
</style>
<template>
  <div class="main_list">
    <!-- <Button @click="updateServer">updateServer</Button>
    {{updateIndex}}-->
    <div class="cover" v-if="updateMark"></div>
    <div class="updateWordBox" v-if="updateMark">
      <update-word @close_box="CloseUpdate" :data="updateItems"></update-word>
    </div>

    <List class="word_list" border size="small">
      <ListItem slot="header" :class="typeMain ? 'right': 'fail'" style="position: relative">
        <span class="title_Left">{{titles[mode]}}</span>
        <span class="SearchInt" v-if="mode === 0 || mode === 3">
          <Input v-model="searchTypes" style="width: 100%" clearable placeholder="search text" />
        </span>
        <span class="total_length" v-show="!spel_length">{{cn_change.length}}/{{total}} 个单词</span>
        <span class="total_length" v-show="spel_length">{{spel_length}} 个单词</span>
        <!-- <Icon style="position: absolute;right: 16px" type="md-add" /> -->
      </ListItem>
      <ListItem v-if="(mode === 0 && list.length) || (mode === 3 && list.length)" class="y_en">
        <div
          v-for="(item, indx) in (!searchTypes ? list : searchList)"
          class="word_item_box"
          :key="indx"
          :style="{backgroundColor: item.back_color ? '#f18075':'', color: item.back_color ? 'white' : ''}"
          @click="handleConvert($event, item)"
          @mouseenter="handleHover($event, item)"
          @mouseleave="handleHover($event, item)"
        >
          <span style="font-size: 14px;font-weight:600;margin-right:4px">{{item.en}}</span>
          [{{item.ps}}] {{resultWord(item)}}
          <ButtonGroup size="small" class="spells">
            <!-- <Button>Small</Button> -->
            <Button @click.stop="handleSpell(item)" v-show="item.ctrl === 0">
              <!-- spell -->
              <Icon type="md-bookmarks" />
            </Button>
            <!-- <Button @click.stop="wordUpdated(item)">
              <Icon type="md-create" />
            </Button>-->
          </ButtonGroup>
        </div>
      </ListItem>
      <ListItem class="y_en2" v-show="mode != 0 && mode != 3">
        <div class="word_text" ref="word_text">{{word}}</div>
        <div class="word_iput">
          <input
            class="mine_input"
            ref="change_Inpt"
            @input="handleInput($event)"
            placeholder="请输入"
            type="text"
          />
        </div>
        <div v-show="nextIcon" class="next_icon">
          <Icon @click="handleNext" v-show="!EmitMode" size="20" type="md-arrow-forward" />
          <Button
            class="toogle_mode"
            type="primary"
            v-show="mode != 0 && EmitMode && typeMain"
            @click="changeMode(0)"
          >单词本</Button>
          <Button
            type="error"
            v-show="mode != 0 && EmitMode && !typeMain"
            @click="changeMode(3, 'end')"
          >错词本</Button>
        </div>
      </ListItem>
      <ListItem v-if="showCardInformations" class="Item_List">
        <div class="word_Big_Title">
          <h3 style="font-size: 30px;margin-right: 10px">{{showCardInformations.en}}</h3>
          <div class="word_ps">[{{showCardInformations.ps}}]</div>
          <div>
            <Icon
              size="20"
              class="word_ps"
              style="margin-left: 10px"
              @click="handleFanYi(showCardInformations)"
              :type="showCardInformations.audio ? 'ios-play' : 'ios-pause'"
            />
          </div>
        </div>
        <div
          v-for="(ItemCns, IndexCns) in resultWord(showCardInformations, {layout: 'column'})"
          class="word_cns"
          :key="IndexCns"
        >{{ItemCns}}</div>
      </ListItem>
      <ListItem>
        <Button class="toogle_mode" type="primary" v-show="mode != 1" @click="changeMode(1)">拼写</Button>
        <Button class="toogle_mode" type="primary" v-show="mode != 2" @click="changeMode(2)">翻译</Button>
        <Button class="toogle_mode" type="primary" v-show="mode != 0" @click="changeMode(0)">单词本</Button>
        <Button type="error" v-show="WrongVersion.length" @click="changeMode(3)">错词本</Button>
        <Button @click="handleClearSpell" v-show="mode === 0">清空 spell 列表</Button>
        <!-- <Button class="word_tips" type="warning" shape="circle">提示</Button> -->
        <span class="word_tips" v-show="mode != 0 && typeMain && mode != 2">
          <ButtonGroup size="small">
            <Button @click="TipsWord">单词提示</Button>
            <!-- <Button>Small</Button> -->
          </ButtonGroup>
        </span>
      </ListItem>
      <ListItem v-show="mode != 1 && mode != 2">
        <add-word-form :clear="clearObj" @addWord="handleResopns"></add-word-form>
        <!-- <Input search enter-button="添加单词" @on-search="addWordText" placeholder="请输入单词" /> -->
      </ListItem>
    </List>
  </div>
</template>

<script>
import addWordForm from "./addWord.vue";
import updateWord from "../learn_en/updateWord.vue";
import { postWord } from "../public_method/index";

export default {
  props: {
    msg: String,
    shortKeys: Object
  },
  components: {
    addWordForm,
    updateWord
  },
  data() {
    return {
      updateMark: false,
      updateItems: null,
      clearObj: false,
      updateIndex: 0, // 更新 Server
      typeMain: true, //控制当前 单词本的主题
      searchTypes: "",
      searchList: [],
      total: 0,
      inner: 10,
      titles: ["单词本", "单词拼写", "英文翻译", "错词本"],
      list: [],
      WrongShow: false,
      spells: [], //拼写单词
      spel_length: 0,
      cn_change: [], //单词翻译
      mode: 0, // 在 (单词本 拼写 翻译) 中来回切换的索引
      word: "", //单词 或 中文 模式的title
      wordEn: "", // 匹配英文 or 中文 输入
      nextIcon: false, // 控制 单词本按键 和 下一个单词按键 的父级盒子
      EmitMode: false, //控制 单词本按键 和 下一个单词按键 的显示循序
      showCardInformations: null,
      WrongVersion: localStorage.getItem("WrongWord")
        ? JSON.parse(localStorage.getItem("WrongWord"))
        : []
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    wordUpdated(item) {
      this.updateItems = JSON.parse(JSON.stringify(item));
      this.updateMark = true;
    },
    CloseUpdate(cls) {
      this.updateMark = cls;
    },
    handleClearSpell() {
      this.list.filter((clearSpell, clearI) => {
        clearSpell.ctrl = 0;
      });
    },
    handleSpell(item) {
      this.list.filter((apd, api) => {
        if (item.en === apd.en) {
          apd.ctrl = 1;
        }
      });
    },
    handleFanYi(item) {
      let that = this;
      item.audio = false;
      this.$http({
        url: `/static/media/${item.en}.mp3`,
        responseType: "arraybuffer",
        method: "get"
      })
        .then(res => {
          let media = new Audio();
          media.src = `/static/media/${item.en}.mp3`;
          media.play();
          media.addEventListener("ended", function(e) {
            item.audio = true;
            media = null;
          });
        })
        .catch(err => {
          item.audio = true;
          alert("没有此音频");
        });
    },
    getUsers() {
      this.$Message.info({
        content: "正在请求数据",
        duration: 2
      });
      this.$http({
        url: "/api/addWord",
        method: "get"
      })
        .then(rs => {
          if (!rs.data.data.length) {
            this.$Message.info({
              content: "已经启用本地数据",
              duration: 1
            });
            this.list = JSON.parse(localStorage.getItem("wordTable"))
              ? JSON.parse(localStorage.getItem("wordTable"))
              : [];

            this.total = JSON.parse(localStorage.getItem("wordTable"))
              ? JSON.parse(localStorage.getItem("wordTable")).length
              : 0;
            return;
          }
          this.$Message.info({
            content: "请求成功",
            duration: 2
          });
          let emp = rs.data.data.filter((ems, emi) => {
            return !ems.en;
          });
          this.list = rs.data.data;
          this.total = this.list.length;
          // console.log("login-----", rs, emp);
        })
        .catch(err => {
          this.$Message.info({
            content: "已经启用本地数据",
            duration: 1
          });
          this.list = JSON.parse(localStorage.getItem("wordTable"))
            ? JSON.parse(localStorage.getItem("wordTable"))
            : [];

          this.total = JSON.parse(localStorage.getItem("wordTable"))
            ? JSON.parse(localStorage.getItem("wordTable")).length
            : 0;
        });
    },
    postUsers(datas) {
      this.$http({
        url: "/api/addWord",
        method: "post",
        data: datas
      })
        .then(rs => {
          this.updateIndex++;
          console.log("login-----", rs, this.updateIndex);
          if (this.updateIndex < this.list.length) {
            setTimeout(() => {
              this.postUsers(this.list[this.updateIndex]);
            }, 890);
          }
        })
        .catch(err => {
          console.log("login ERR", err);
        });
    },
    handlePullFanYi(text) {
      // console.log("download", text);
      // return;
      //   let { text } = this.fanyiMp3;
      if (!text) {
        alert("空");
        return;
      }
      console.log("发送请求");
      this.$http({
        url: `/gettts?lan=uk&text=${text}&spd=3&source=web`,
        method: "get",
        responseType: "arraybuffer"
      })
        .then(res => {
          console.log("audio", res);
          let blob = new Blob([res.data], {
            type: "audio/mpeg;charset=utf-8"
          });
          let fileName = text + ".mp3";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            let elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            // document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            // document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
        .catch(err => {
          console.log("Err audio", err);
        });
    },
    handleResopns(v, clears) {
      if (clears) {
        this.clearObj ? (this.clearObj = false) : null;
        return;
      }
      // console.log("new word", v);
      // return
      var flag = this.list.some(lop => {
        return lop.en === v.en;
      });

      if (flag) {
        this.$Message.error("单词已存在");
        !clears ? (this.clearObj = true) : null;
      } else {
        postWord(
          this,
          { method: "post", data: v },
          (status, data) => {
            if (status) {
              this.$Message.error("添加成功");
              this.list.push(v);
              var str = JSON.stringify(this.list);
              localStorage.setItem("wordTable", str);
              this.total = this.list.length;
              !clears ? (this.clearObj = true) : null;
            } else {
              this.$Message.error("添加失败");
            }
          }
        );
      }
    },
    changeMode(num, model) {
      console.log("mode", num, model, this.WrongVersion);
      if (model) {
        let SaveTemp = this.WrongVersion.filter((v, i) => {
          return v.en != this.wordEn;
        });
        if (!SaveTemp.length) {
          this.WrongVersion = [];
          localStorage.setItem("WrongWord", "");
          this.cn_change = [];
          this.typeMain = true;
          this.mode = 0;
        } else {
          this.WrongVersion = SaveTemp;
          localStorage.setItem("WrongWord", JSON.stringify(SaveTemp));
          this.mode = 3;
        }
      } else {
        this.cn_change = [];
        if (num === 0) {
          !this.typeMain ? (this.typeMain = true) : null;
        }
        this.mode = num;
      }
    },
    changeList(indx) {
      let lens = this.spells.length,
        lens2 = this.list.length;
      if (lens) {
        this.spel_length = lens;
        if (lens < this.inner) {
          this.inner = lens;
        }

        let num = parseInt(Math.random() * this.inner),
          temp = null;
        this.word =
          indx === 1
            ? this.handlePreFix(this.spells[num])
            : ((this.wordEn = this.resultWord(this.spells[num], {
                layout: "join"
              }).joinText),
              this.spells[num].en);
        temp = this.spells.splice(num, 1);
        this.cn_change.push(temp[0]);
        this.spells.length === 0 ? (this.EmitMode = true) : null;
        return;
      }
      if (lens2) {
        if (lens2 < this.inner) {
          this.inner = lens2;
        }

        let num2 = parseInt(Math.random() * this.inner),
          temp2 = null;
        this.word =
          indx === 1
            ? this.handlePreFix(this.list[num2])
            : ((this.wordEn = this.resultWord(this.list[num2], {
                layout: "join"
              }).joinText),
              this.list[num2].en);
        temp2 = this.list.splice(num2, 1);
        this.cn_change.push(temp2[0]);
        this.list.length === 0 ? (this.EmitMode = true) : null;
      }
    },
    handlePreFix(ob) {
      this.wordEn = ob.en;
      var pre = Object.keys(ob);
      let newPre = pre.filter((v, i) => {
        return (
          v != "en" &&
          v != "ps" &&
          v != "desc" &&
          v != "_v" &&
          v != "_id" &&
          v != "audio" &&
          v != "ctrl"
        );
      });
      let contentBox = newPre.filter((cont, coi) => {
        return ob[cont];
      });
      let num = parseInt(Math.random() * contentBox.length);
      // console.log("newPre", num, Object.keys(ob), contentBox);
      if (ob["n"]) {
        return "n" + "." + ob["n"];
      }
      if (ob["v"]) {
        return "v" + "." + ob["v"];
      }
      return contentBox[num] + "." + ob[contentBox[num]];
    },
    handleNext() {
      this.$refs.word_text.style.color = "#000";
      this.$refs.change_Inpt.value = "";
      if (this.list.length) {
        this.nextIcon ? (this.nextIcon = false) : null;
      } else {
        this.$Message.error("这是最后一个单词");
      }
      this.changeList(this.mode);
    },
    handleInput(e) {
      // this.cn_change.filter(Itext => {
      switch (this.mode) {
        case 1:
          // if (Itext.en === this.wordEn) {
          e.target.value === this.wordEn
            ? ((this.$refs.word_text.style.color = "green"),
              (this.nextIcon = true))
            : ((this.$refs.word_text.style.color = "#000"),
              (this.nextIcon = false));
          // }
          break;
        case 2:
          let flag = this.wordEn.split(" ").some((Mtext, Itext) => {
            return Mtext === e.target.value;
          });
          flag
            ? ((this.$refs.word_text.style.color = "green"),
              (this.nextIcon = true))
            : ((this.$refs.word_text.style.color = "#000"),
              (this.nextIcon = false));
          break;
        default:
      }
      // });
    },
    handleSave() {
      console.log("this.list");
      // this.list.filter((item, index) => {
      //   item.audio = true;
      // });
      // localStorage.setItem("wordTable", JSON.stringify(this.list))
      console.log("this.list", this.list);
      // var temp = JSON.stringify(this.list);
      // localStorage.setItem("wordTable", temp);
    },
    handleHover(e, num) {
      if (e.type === "mouseenter") {
        if (!num.back_color) {
          e.target.style.backgroundColor = "#f18075";
          e.target.style.color = "white";
        }
      } else {
        if (!num.back_color) {
          e.target.style.backgroundColor = "";
          e.target.style.color = "";
        }
      }
    },
    resultWord(item, obs) {
      var wordText = [];
      for (var k in item) {
        if (
          item[k] &&
          k != "en" &&
          k != "ps" &&
          k != "desc" &&
          k != "_v" &&
          k != "_id" &&
          k != "audio" &&
          k != "back_color" &&
          k != "ctrl"
        ) {
          if (obs) {
            switch (obs.layout) {
              case "column":
                wordText.push(k + "." + item[k]);
                break;
              case "join":
                wordText.push(item[k]);
                break;
              default:
            }
          } else {
            wordText.push(k + "." + item[k].split(" ")[0]);
          }
        }
      }

      if (obs) {
        switch (obs.layout) {
          case "column":
            break;
          case "join":
            let strCn = wordText.join(" ");
            wordText = {
              joinText: strCn,
              en: item.en
            };
            break;
          default:
        }
        return wordText;
      } else {
        return wordText.join("  ");
      }
    },
    handleConvert(e, item) {
      this.list.filter((Mback, Iback) => {
        if (Mback.en === item.en) {
          Mback.back_color = true;
        } else {
          Mback.back_color = false;
        }
      });
      // console.log("Convert", item);
      this.showCardInformations = JSON.parse(JSON.stringify(item));
    },
    searchSet(text) {
      let Scope = [];
      if (!text) {
        return;
      }
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      if (pattern.test(text)) {
        this.list.filter((item, index) => {
          let cns = this.resultWord(item, { layout: "join" });
          Scope.push(cns);
        });
        let result = Scope.filter((Mscope, Iscope) => {
          return this.searchSon(Mscope.joinText.split(" "), text);
        });
        result.filter((MEqual, IEqual) => {
          this.list.filter((MVqual, IVqual) => {
            if (MEqual.en === MVqual.en) {
              this.searchList.push(MVqual);
            }
          });
        });
      } else {
        this.list.filter((EWord, IWord) => {
          if (EWord.en.indexOf(text) != -1) {
            this.searchList.push(EWord);
          }
        });
      }
    },
    searchSon(arr, text) {
      return arr.some((MSon, ISon) => {
        return MSon === text;
      });
    },
    TipsWord() {
      this.nextIcon = true;
      let flag = null;
      if (this.mode === 1) {
        this.$refs.change_Inpt.value = this.wordEn;
        this.$refs.word_text.style.color = "green";
        // console.log('WrongVersion', this.cn_change);
        this.cn_change.filter((Mwrong, Iwrong) => {
          if (Mwrong.en === this.wordEn) {
            if (this.WrongVersion.length) {
              flag = this.WrongVersion.some((MAppend, IAppend) => {
                return Mwrong.en === MAppend.en;
              });
            }
            Mwrong.ctrl = 0;
            !flag ? this.WrongVersion.push(Mwrong) : null;
          }
        });
        if (this.WrongVersion.length) {
          !localStorage.getItem("WrongWord") ||
          JSON.parse(localStorage.getItem("WrongWord")).length !=
            this.WrongVersion.length
            ? localStorage.setItem(
                "WrongWord",
                JSON.stringify(this.WrongVersion)
              )
            : null;
          // console.log("this.Wrong", this.WrongVersion);
        }
      }
    },
    updateServer() {
      // this.list.filter((item, index) => {
      //   item.back_color = false;
      //   item.audio = true;
      //   item.ctrl = 0;
      // });
      // localStorage.setItem("wordTable", JSON.stringify(this.list));
      console.log("nums", this.updateIndex);
      if (this.updateIndex < this.list.length) {
        this.postUsers(this.list[this.updateIndex]);
      }
    }
  },
  watch: {
    searchTypes: function(n) {
      this.searchList.length ? (this.searchList = []) : null;
      this.searchSet(n);
    },
    mode: function(n) {
      this.EmitMode = false;
      this.nextIcon = false;
      this.$refs.word_text.style.color = "#000";
      this.$refs.change_Inpt.value = "";
      if (
        localStorage.getItem("wordTable") &&
        this.list.length !=
          JSON.parse(localStorage.getItem("wordTable")).length &&
        this.typeMain
      ) {
        this.list = JSON.parse(localStorage.getItem("wordTable"));
        this.total = this.list.length;
      }
      switch (n) {
        case 0:
          this.spel_length = 0;
          break;
        case 1:
          // if (this.typeMain) {
          let spellWord = this.list.filter((Mreset, Ireset) => {
            Mreset.back_color ? (Mreset.back_color = false) : null;
            return Mreset.ctrl === 1;
          });
          this.spells = spellWord;
          // }
          break;
        case 2:
          let spellWord2 = this.list.filter((Mreset, Ireset) => {
            Mreset.back_color ? (Mreset.back_color = false) : null;
            return Mreset.ctrl === 1;
          });
          this.spells = spellWord2;
          break;
        case 3:
          if (this.WrongVersion.length) {
            this.list = JSON.parse(JSON.stringify(this.WrongVersion));
            this.total = this.list.length;
          } else {
            this.list = [];
          }
          this.typeMain ? (this.typeMain = false) : null;
          break;
        default:
      }
      if (n != 0 && n != 3) {
        this.showCardInformations = null;
        this.changeList(n);
      }
    },
    cn_change: {
      handler(n) {
        // console.log(`cn_change:`, n.length, `\nlist:`, this.list.length);
        if (!this.typeMain) {
          if (n.length > 1) {
            let newTemp = localStorage.getItem("WrongWord")
              ? JSON.parse(localStorage.getItem("WrongWord"))
              : null;
            let newSave = this.WrongVersion.filter((v, i) => {
              return v.en != n[n.length - 2].en;
            });
            this.WrongVersion = newSave;
            localStorage.setItem(
              "WrongWord",
              JSON.stringify(this.WrongVersion)
            );
          }
        }
      },
      deep: true
    },
    shortKeys: {
      handler(n) {
        let { c, s, a } = n;
        if (this.nextIcon) {
          if (this.EmitMode) {
            if (c === 17 && s === 39)
              this.typeMain ? this.changeMode(0) : this.changeMode(3, "end");
          } else {
            c === 17 && s === 39 ? this.handleNext() : null;
          }
        }
      },
      deep: true
    },
    spells: {
      handler(n) {
        // console.log("spells", n);
      },
      deep: true
    }
  }
};
</script>
