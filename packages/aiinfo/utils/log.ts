import ansis from "ansis";
import  { type LogObject, type LogProps } from "../types";

const groupHeader = (
  title = "",
  color: LogObject["color"] = "cyan",
  style: LogObject["style"] = "bold",
): string => {
  try {
    const line = "═".repeat(38);
    let header = `╔${line}╗\n║ ${title.padEnd(37)}║\n╚${line}╝`;
    if (color && typeof color === "string" && color in ansis) {
      header = ansis[color](header);
    }
    if (style && typeof style === "string" && style in ansis) {
      header = ansis[style](header);
    }
    return header;
  } catch (error) {
    console.error("Error in groupHeader:", error);
    return `╔══════════════════════════════════════╗\n║ Error generating header             ║\n╚══════════════════════════════════════╝`;
  }
};

const groupFooter = (color: LogObject["color"] = "cyan"): string => {
  try {
    return ansis[color]("═".repeat(40));
  } catch (error) {
    console.error("Error in groupFooter:", error);
    return "════════════════════════════════════════";
  }
};

const Log = (content: LogProps): void => {
  try {
    const {
      message,
      type = "log",
      start = false,
      end = false,
      color,
      style,
    } = content as LogObject;
    const format = (msg: unknown): unknown => {
      try {
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
      } catch (error) {
        console.error("Error formatting log message:", error);
        return "Error formatting log message";
      }
    };
    if (start) {
      console.group(groupHeader(typeof message === "string" ? message : undefined, color));
      return;
    }
    if (end) {
      console.groupEnd();
      if (typeof console[type] === "function") {
        console[type](`${groupFooter(color)}\n`);
      } else {
        console.error(`Error in Log: console method "${type}" does not exist`);
        console.log("Error logging message");
      }
      return;
    }
    if (typeof content === "number" || typeof content === "string" || Array.isArray(content)) {
      if (Array.isArray(content)) {
        content.forEach((msg) => {
          console.log(format(msg));
        });
      } else {
        console.log(format(content));
      }
      return;
    }

    const logMethod = typeof console[type] === "function" ? console[type].bind(console) : undefined;

    if (Array.isArray(message)) {
      for (const item of message) {
        try {
          if (
            typeof item === "string" &&
            color &&
            typeof color === "string" &&
            color in ansis &&
            style &&
            typeof style === "string" &&
            style in ansis
          ) {
            if (logMethod) {
              logMethod(ansis[style](ansis[color](item)));
            } else {
              throw new Error(`Console method "${type}" does not exist`);
            }
          } else {
            if (logMethod) {
              logMethod(item);
            } else {
              throw new Error(`Console method "${type}" does not exist`);
            }
          }
        } catch (error) {
          console.error("Error in Log:", error);
          console.log("Error logging message");
        }
      }
      return;
    } else {
      try {
        if (
          typeof message === "string" &&
          color &&
          typeof color === "string" &&
          color in ansis &&
          style &&
          typeof style === "string" &&
          style in ansis
        ) {
          if (logMethod) {
            logMethod(ansis[style](ansis[color](message)));
          } else {
            throw new Error(`Console method "${type}" does not exist`);
          }
        } else {
          if (logMethod) {
            logMethod(message);
          } else {
            throw new Error(`Console method "${type}" does not exist`);
          }
        }
      } catch (error) {
        console.error("Error in Log:", error);
        console.log("Error logging message");
      }
    }
  } catch (error) {
    console.error("Error in Log:", error);
    console.log("Error logging message");
  }
};

export { Log };
