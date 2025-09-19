// browserslists does not provide type declarations
// lightningcss expects an array of strings `<browser> <version>`
// but is typed as a string array `string[]` in the function definition.
type BrowserVersionString = `${string} ${string}`;

declare module "@instructure/browserslist-config-instui" {
	const config: BrowserVersionString[];
	export default config;
}
