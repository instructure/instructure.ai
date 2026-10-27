#!/usr/bin/env node
import { generate } from "../../generate.mjs";
await generate("esm", process.argv[2]);
