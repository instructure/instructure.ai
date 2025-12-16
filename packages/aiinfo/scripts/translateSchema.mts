import { Output, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import pLimit from "p-limit";
import { TRANSLATE_PROMPT, EntrySchema, LOCALES } from "../utils";

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

const limit = pLimit(3);

const wrapper = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
const config = {
  google: {
    structuredOutputs: true,
    thinkingConfig: {
      includeThoughts: false, thinkingLevel: "low",
    },
  },
};

const translateJsonStrings = async ({
  payload,
  locale,
  model = "gemini-3-pro-preview",
  sourceLocale = "en_US",
  type = "entry",
}: {
  payload: Json;
  locale: string;
  model?: string;
  sourceLocale?: string;
  type?: "entry" | "headers";
}): Promise<Json> => {
  const prompt = [
    TRANSLATE_PROMPT,
    `Translate the following JSON from source locale "${sourceLocale}" to target locale "${locale}".`,
    `JSON:`,
    JSON.stringify(payload),
  ].join("\n");

  const { text } = await generateText({
    model: wrapper(model), output: Output.object({ schema: EntrySchema }), prompt, providerOptions: config, temperature: 0,
  });

  let parsed: Json;
  try {
    parsed = JSON.parse(text) as Json;
  } catch (error) {
    // Save the raw output for debugging
    throw new Error("Translation returned invalid JSON.", error as ErrorOptions);
  }

  // Basic shape guard: stringify and compare to ensure it’s JSON-serializable
  JSON.stringify(parsed);
  return parsed;
};

const main = async <T extends { id: string; payload: Json }>({
  items,
  locale,
  model,
  sourceLocale = "en_US",
}: {
  items: T[];
  locale: string;
  model?: string;
  sourceLocale?: string;
}): Promise<(T & { translated: Json })[]> => {
  return Promise.all(
    items.map((item) =>
      limit(async () => ({
        ...item,
        translated: await translateJsonStrings({
          locale, model, payload: item.payload, sourceLocale,
        }),
      })),
    ),
  );
};

export { main, main as TranslateEntry };