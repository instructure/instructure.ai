#!/usr/bin/env node
import { generate } from "../../generate.mjs";
await generate("react", process.argv[2]);
