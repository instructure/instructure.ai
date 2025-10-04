import ansis from "ansis";
import type { LogObject, LogProps } from "../types";

const groupHeader = (
	title: string = "",
	color: LogObject["color"] = "cyan",
	style: LogObject["style"] = "bold",
): string => {
	const line = "═".repeat(38);
	let header: string = `╔${line}╗\n║ ${title.padEnd(37)}║\n╚${line}╝`;
	if (color && typeof color === "string" && color in ansis) {
		header = ansis[color](header);
	}
	if (style && typeof style === "string" && style in ansis) {
		header = ansis[style](header);
	}
	return header;
};

const groupFooter = (color: LogObject["color"] = "cyan"): string =>
	ansis[color]("═".repeat(40));

const Log = (content: LogProps): void => {
	const {
		message,
		type = "log",
		start = false,
		end = false,
		color,
		style,
	} = content as LogObject;
	const format = (msg: unknown): string | unknown => {
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
		return msg;
	};
	if (start) {
		console.group(
			groupHeader(typeof message === "string" ? message : undefined, color),
		);
		return;
	}
	if (end) {
		console.groupEnd();
		console[type](`${groupFooter(color)}\n`);
		return;
	}
	if (
		typeof content === "number" ||
		typeof content === "string" ||
		Array.isArray(content)
	) {
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
			console[type](format(msg));
		});
	} else {
		console[type](format(message));
	}
};

export { Log };
