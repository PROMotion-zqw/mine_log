<template>
  <Form ref="formInline" :model="formInline" inline>
    <FormItem prop="en">
      <Input type="text" v-model="formInline.en" placeholder="输入单词" style="width: 200px">
        <span slot="prepend">单词</span>
      </Input>
    </FormItem>
    <FormItem prop="ps">
      <Input type="text" v-model="formInline.ps" placeholder="输入音标" style="width: 200px">
        <span slot="prepend">音标</span>
      </Input>
    </FormItem>
    <Divider class="mine_diver">翻译</Divider>
    <FormItem
      v-for="(value, k, indx) in formInline"
      v-if="k != 'en' && k != 'ps' && k != 'desc' && k != 'audio' && k != 'ctrl'"
      :key="k"
      :prop="k"
    >
      <Input type="text" v-model="formInline[k]" :placeholder="wordText[k]" style="width: 200px">
        <span slot="prepend">{{k}}.</span>
      </Input>
    </FormItem>
    <Divider class="mine_diver">描述</Divider>
    <FormItem class="ds_box">
      <Input v-model="formInline.desc" type="textarea" placeholder="单词描述" class="desc" />
    </FormItem>
    <br />
    <FormItem>
      <Button type="primary" @click="handleSubmit('formInline')">添加单词</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: ["clear"],
  data() {
    return {
      formInline: {
        v: "", //动词
        n: "", //名词
        adj: "", //形容词
        adv: "", //副词
        pron: "", //代词
        prep: "", //介词
        vi: "",
        vt: "", //及物动词
        s: "",
        conj: "",
        sc: "",
        o: "",
        oc: "",
        "aux v": "",
        art: "",
        num: "",
        u: "",
        c: "",
        pl: "",
        en: "",
        ps: "",
        desc: "",
        det: "",
        int: ""
      },
      wordText: {
        v: "动词",
        n: "名词",
        adj: "形容词",
        adv: "副词",
        pron: "代词",
        prep: "介词",
        vi: "不及物动词",
        vt: "及物动词",
        s: "主词",
        conj: "连接词",
        sc: "主词补语",
        o: "受词 宾语",
        oc: "受词 补语",
        "aux v": "助动词",
        art: "冠词",
        num: "数词",
        u: "不可数名词",
        c: "可数名词",
        pl: "复数",
        det: "限定词",
        int: "感叹词"
      },
      err_title: {
        en: "单词不能为空",
        ps: "音标不能为空"
      }
    };
  },
  methods: {
    handleSubmit(name) {
      //   console.log('formInline', this.formInline);
      let msg = this.handleEmpty(this.formInline, ["en", "ps"]);
      if (msg) {
        this.$Message.warning(msg);
        msg = null;
        return;
      }
      var tempNewWord = JSON.parse(JSON.stringify(this.formInline));
      tempNewWord.audio = true;
      tempNewWord.back_color = false;
      tempNewWord.ctrl = 0;
      this.$emit("addWord", tempNewWord, this.clear);
    },
    handleEmpty(ob, arr) {
      let err_msg = "";
      arr.filter((v, i) => {
        if (!ob[v]) {
          !err_msg ? (err_msg = this.err_title[v]) : null;
        }
      });

      if (err_msg) {
        return err_msg;
      } else {
        return 0;
      }
    }
  },
  watch: {
    clear: function(n) {
      if (n) {
        Object.keys(this.formInline).filter(clearI => {
          this.formInline[clearI] = "";
        });
        this.$emit("addWord", null, n);
      }
    }
  }
};
</script>
