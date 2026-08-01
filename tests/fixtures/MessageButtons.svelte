<script lang="ts">
	import { useMessage } from '../../src/lib/index.js';
	const message = useMessage();
</script>

<button type="button" onclick={() => message.success({ message: 'Saved', duration: 10000 })}
	>Notify saved</button
>
<button type="button" onclick={() => message.warning({ message: 'Careful', duration: 10000 })}
	>Notify warning</button
>
