/**
 * Clipboard access for the content actions.
 *
 * Text only, read only on an explicit Paste click. No permission prompt while
 * a menu opens or hovers, and no clipboard event overrides.
 */

export type ClipboardResult = {
	ok: boolean;
	text?: string;
	detail?: string;
};

export async function writeClipboardText( text: string ): Promise< ClipboardResult > {
	if (
		typeof navigator === 'undefined' ||
		! navigator.clipboard ||
		typeof navigator.clipboard.writeText !== 'function'
	) {
		return { ok: false, detail: 'unavailable' };
	}

	try {
		await navigator.clipboard.writeText( text );
		return { ok: true };
	} catch {
		return { ok: false, detail: 'blocked' };
	}
}

export async function readClipboardText(): Promise< ClipboardResult > {
	if (
		typeof navigator === 'undefined' ||
		! navigator.clipboard ||
		typeof navigator.clipboard.readText !== 'function'
	) {
		return { ok: false, detail: 'unavailable' };
	}

	try {
		const text = await navigator.clipboard.readText();

		return typeof text === 'string'
			? { ok: true, text }
			: { ok: false, detail: 'blocked' };
	} catch {
		return { ok: false, detail: 'blocked' };
	}
}
