<style scoped>
.docApi {
    width: 90%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
</style>
<template>
    <div class="docApi">
        <h3>Api Table</h3>
        <addApi />
    </div>
</template>
<script>
import addApi from "./add_docApi";
export default {
    data() {
        return {

        }
    },
    components: {
        addApi
    }
}
</script>