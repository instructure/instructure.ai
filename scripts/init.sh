#!/bin/bash

# Check for package name argument
if [ -z "$1" ]; then
  echo "Usage: $0 <packagename> [--template \"vanilla\" | \"react\"]"
  exit 1
fi

PACKAGENAME="$1"
TEMPLATE="vanilla"
REPLACESTRING="<<packagename>>"

# Validate packagename for npm scoped package: @instructure.ai/<packagename>
if [[ ! "$PACKAGENAME" =~ ^[a-z0-9][a-z0-9.\-]*$ ]]; then
  echo "Error: Package name must be valid NPM package name"
  echo "lowercase, numbers, hyphens, periods, and start with a letter or number."
  exit 1
fi

# Check if package already exists in ./packages
if [ -d "./packages/$PACKAGENAME" ]; then
  echo "Error: Package '$PACKAGENAME' already exists in ./packages."
  exit 1
fi

# Parse optional --template argument
if [[ "$2" == "--template" ]]; then
  if [[ "$3" == "react" ]]; then
    TEMPLATE="react"
  fi
fi

echo "Initializing package: $PACKAGENAME"
echo "Using template: $TEMPLATE"

mkdir "./packages/$PACKAGENAME"
cp -R ./.template/shared/. "./packages/$PACKAGENAME/"
cp -R ./.template/$TEMPLATE/. "./packages/$PACKAGENAME/"
if [ -f "./packages/$PACKAGENAME/package.json" ]; then
  sed -i '' "s/$REPLACESTRING/$PACKAGENAME/g" "./packages/$PACKAGENAME/package.json"
fi
if [ -f "./packages/$PACKAGENAME/README.md" ]; then
  sed -i '' "s/$REPLACESTRING/$PACKAGENAME/g" "./packages/$PACKAGENAME/README.md"
fi


echo "Installing dependencies..."
pnpm --filter $PACKAGENAME install

echo "Package '$PACKAGENAME' initialized successfully."
echo "\`pnpm dev $PACKAGENAME\` to run the development server."

exit 0;