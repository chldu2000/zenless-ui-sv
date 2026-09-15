export const buttonStyles = String.raw`
	:host { display: inline-block; vertical-align: middle; }
	:host([hidden]) { display: none; }
	button {
		display: inline-flex; justify-content: center; align-items: center; position: relative;
		box-sizing: content-box; min-width: 1em; min-height: 1em; margin: 0; padding: 12px 28px;
		border: 1px solid #000; border-radius: 6px; appearance: none; outline: none;
		font: inherit; font-size: 14px; line-height: 1; white-space: nowrap; text-align: center;
		color: #fff; background-color: var(--z-button-color, #000); cursor: pointer; user-select: none;
		background-image: linear-gradient(45deg, rgb(255 255 255 / 6%) 25%, transparent 0 75%, rgb(255 255 255 / 6%) 0);
		background-size: 6px 6px;
	}
	button::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
		box-shadow: inset 0 1px 2px rgb(255 255 255 / 20%), inset 0 0 0 3px var(--z-button-color, #333), inset 0 0 0 4px #000; }
	button:focus-visible { outline: 3px solid var(--zenless-focus, #fff); outline-offset: 3px; }
	button.round { border-radius: var(--zenless-border-radius-round, 9999px); }
	button.circle { border-radius: 50%; padding: 12px; }
	button.plain { color: #000; }
	button.plain::after { background: rgb(255 255 255 / 60%); }
	button.hollow { color: #fff; background: #000; }
	button.highlight:not(:disabled) { animation: highlight 1s ease-in-out infinite alternate; }
	button:disabled { color: #666; background-color: #000; cursor: not-allowed; }
	button:disabled::after { box-shadow: inset 0 1px 2px rgb(255 255 255 / 20%), inset 0 0 0 3px #737373; }
	button.extra { padding: 16px 58px; font-size: 18px; }
	button.large { padding: 14px 46px; font-size: 16px; }
	button.small { padding: 10px 22px; font-size: 12px; }
	button.mini { padding: 8px 16px; font-size: 12px; }
	@keyframes highlight { from { color: var(--zenless-gradient-yellow, #ffea00); } to { color: var(--zenless-gradient-green, #91bc00); } }
	@media (prefers-reduced-motion: reduce) { button.highlight { animation-duration: .001ms; } }
`;
