#!/usr/bin/env node
import { generate } from "../../generate.mjs";
await generate("instui", process.argv[2]);
