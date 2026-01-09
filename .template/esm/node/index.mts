#!/usr/bin/env node

const main = async () => {
  console.log("Hello World!");
};

main().catch((error) => {
  throw new Error(error);
});
