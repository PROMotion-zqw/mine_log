<style scoped>
.ps_mark {
  float: left;
  height: 44px;
  font-size: 18px;
  line-height: 46px;
}
</style>>
<template>
  <div>
    <div>
      <h3 style="font-size: 30px;margin-right: 10px;float: left">{{formInline.en}}</h3>
      <div class="ps_mark">[{{formInline.ps}}]</div>
    </div>
    <Form ref="formInline" :model="formInline" inline>
      <Divider class="mine_diver">翻译</Divider>
      <FormItem prop="back_color">
        <Input
          type="text"
          @input="handleInput($event, 'back_color')"
          v-model="formInline.back_color"
          placeholder="Username"
        >
          <span slot="prepend">背景切换</span>
        </Input>
      </FormItem>
      <FormItem prop="back_color">
        <Input type="text" v-model="formInline.audio ? '1' : '0'" placeholder="Username">
          <span slot="prepend">音频状态</span>
        </Input>
      </FormItem>
      <Divider class="mine_diver">翻译</Divider>
      <FormItem
        v-for="(item, k, index) in formInline"
        :key="index"
        :prop="k"
        v-if="k != 'ps' && k != 'en' && k != '_id' && k != '__v' && k != 'ctrl' && k != 'back_color' && k != 'audio'"
      >
        <Input type="text" v-model="formInline[k]" placeholder="Username">
          <span slot="prepend">{{k}}</span>
        </Input>
      </FormItem>
      <Divider class="mine_diver"></Divider>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">Save Update</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { postWord } from "../public_method/index";
export default {
  props: ["data"],
  data() {
    return {
      formInline: null
    };
  },
  created() {
    console.log("data", this.data);
    this.formInline = JSON.parse(JSON.stringify(this.data));
  },
  methods: {
    toggleNumber(n) {
      return Number(n);
    },
    handleSubmit(name) {
      console.log("ttts", this.formInline);
      let updateTemp = {
        word_id: this.formInline._id,
        newData: { back_color: false }
      };
      this.$http({
        method: "post",
        url: "/api/updateWord",
        data: updateTemp
      }).then(ress => {
          console.log('resss', ress);
          
      })
      //   this.$emit("close_box", false);
    },
    handleInput(e, attr) {
      if (e === "false") {
        this.formInline[attr] = false;
      }
    }
  }
};
</script>
