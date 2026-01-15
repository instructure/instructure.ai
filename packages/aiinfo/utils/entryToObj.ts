// Oxc-ignore-all assist/source/useSortedKeys: Sane ordering for CSV columns

import { type CSV, type Entry } from "../types";

const entryToObj = (entry: CSV[number]): Entry => {
  if (entry.length !== 26) {
    throw new Error(
      `Invalid entry length: expected 26, got ${entry.length}. Entry: ${JSON.stringify(entry)}`,
    );
  }
  const obj: Entry = {
    compliance: {
      logging: entry[10],
      loggingDescription: entry[11],
      pii: entry[14],
      piiDescription: entry[15],
      regions: entry[12],
      regionsDescription: entry[13],
      retention: entry[9],
    },
    feature: {
      description: entry[3],
      name: entry[2],
    },
    group: entry[22],
    linkTitle: entry[25],
    linkURL: entry[24],
    model: {
      data: entry[7],
      dataDescription: entry[8],
      description: entry[5],
      name: entry[4],
      trained: entry[6],
    },
    outputs: {
      guardrails: entry[19],
      human: entry[17],
      humanDescription: entry[18],
      outcomes: entry[21],
      risks: entry[20],
      settings: entry[16],
    },
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    permissions: entry[23] as Entry["permissions"],
    revision: entry[1],
    uid: entry[0].toLowerCase(),
  };
  return obj;
};

export { entryToObj };
