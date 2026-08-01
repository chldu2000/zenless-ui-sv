<script lang="ts">
	import { ZenlessButton, useMessage } from '$lib/index.js';
	const message = useMessage();
</script>

<ZenlessButton onclick={() => message.success('保存成功')}>显示消息</ZenlessButton>
