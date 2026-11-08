// Runs in the head, before the first paint: the `js` class on the root element
// turns on the styles written with the `js:` variant (and turns off the ones
// written with `not-js:`). Without JavaScript the class never appears.
export const JS_CLASS_SCRIPT = `document.documentElement.classList.add("js")`;
