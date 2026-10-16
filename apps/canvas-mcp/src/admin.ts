import { mountApp } from "./app";

if (typeof globalThis.window !== "undefined") {
	mountApp("admin");
}
