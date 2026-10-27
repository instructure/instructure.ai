#!/usr/bin/env node
import { generate } from "../../generate.mjs";
await generate("vanilla", process.argv[2]);
