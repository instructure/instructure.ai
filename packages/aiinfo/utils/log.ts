import ansis from "ansis";
import type { LogObject, LogProps } from "../types";

const groupHeader = (title?: string): string => {
	const line = "═".repeat(38);
	if (title) {
		return ansis.cyan(`╔${line}╗\n║ ${title.padEnd(37)}║\n╚${line}╝`);
	} else {
		return ansis.cyan(`╔${line}╗\n╚${line}╝`);
	}
};

const groupFooter = (): string => ansis.cyan("═".repeat(40));

const Log = (content: LogProps): void => {
	const {
		message,
		type = "log",
		start = false,
		end = false,
		color,
		style,
	} = content as LogObject;
	const format = (msg: unknown): string => {
		if (typeof msg === "string") {
			let formatted = msg;
			if (color && typeof color === "string" && color in ansis) {
				formatted = ansis[color](formatted);
			}
			if (style && typeof style === "string" && style in ansis) {
				formatted = ansis[style](formatted);
			}
			return formatted;
		}
		if (typeof msg === "object" && msg !== null) {
			return JSON.stringify(msg);
		}
		return String(msg);
	};

	if (start) {
		console.group(
			groupHeader(typeof message === "string" ? message : undefined),
		);
		return;
	}

	if (end) {
		console.groupEnd();
		console[type](`${groupFooter()}\n`);
		return;
	}
	if (typeof content === "string" || Array.isArray(content)) {
		if (Array.isArray(content)) {
			content.forEach((msg) => {
				console.log(format(msg));
			});
		} else {
			console.log(format(content));
		}
		return;
	}
	if (Array.isArray(message)) {
		message.forEach((msg) => {
			console[type](msg);
		});
	} else {
		console[type](message);
	}
};

export { Log };
