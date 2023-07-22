declare module 'emmet-to-element' {
    export function emmetToElements(emmetString: string): HTMLElement[];
    export function simplifiedEmmetToElement(emmetString: string): HTMLElement;
}
