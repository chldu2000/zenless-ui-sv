<script lang="ts">
	import { ZenlessButton, useMessage } from '$lib/index.js';
	const message = useMessage();
</script>

<ZenlessButton onclick={() => message('来自新艾利都的消息')}>显示消息</ZenlessButton>
<ZenlessButton onclick={() => message.success('保存成功')}>成功消息</ZenlessButton>
<ZenlessButton onclick={() => message.warning('请注意当前操作')}>警告消息</ZenlessButton>
<ZenlessButton onclick={() => message.error('委托执行失败')}>错误消息</ZenlessButton>
