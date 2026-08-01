<script lang="ts">
	import {
		ZenlessBadge,
		ZenlessButton,
		ZenlessCard,
		ZenlessIcon,
		ZenlessLink,
		ZenlessPattern,
		ZenlessProgress,
		ZenlessTag
	} from '../../src/lib/index.js';

	let buttonClicks = $state(0);
	let tagClosed = $state(false);
	let linkClicks = $state(0);
</script>

<ZenlessButton type="primary" size="small" icon="check" onclick={() => (buttonClicks += 1)}>
	Save
</ZenlessButton>
<output data-testid="button-clicks">{buttonClicks}</output>

<ZenlessLink href="/guide" underline>Guide</ZenlessLink>
<ZenlessLink disabled onclick={() => (linkClicks += 1)}>Disabled link</ZenlessLink>
<output data-testid="link-clicks">{linkClicks}</output>

<ZenlessTag type="fire" closable onclose={() => (tagClosed = true)}>Fire</ZenlessTag>
<output data-testid="tag-closed">{tagClosed}</output>

<ZenlessBadge type="primary" value={3}><span>Inbox</span></ZenlessBadge>
<ZenlessBadge isDot><span>Online</span></ZenlessBadge>

<ZenlessIcon name="home" size={24} color="electric" aria-label="Home" />
<ZenlessProgress percent={40} color="success" />
<ZenlessProgress type="circle" percent={75} color="#ff00aa">75%</ZenlessProgress>
<ZenlessCard title="Proxy" content="Welcome"
	><span data-testid="card-child">Card child</span></ZenlessCard
>
<ZenlessPattern type="stripes" data-testid="pattern">Pattern</ZenlessPattern>
