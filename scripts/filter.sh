#!/bin/bash

COMMAND="$1"
PACKAGE="$2"
ARGS="${@:3}"

VALID_PACKAGES=$(ls ./packages)

if echo "$VALID_PACKAGES" | grep -qx "$PACKAGE"; then
  pnpm --filter "@instructure.ai/$PACKAGE" "$COMMAND" $ARGS
else
  echo -e "Error: '$PACKAGE' is not a valid package. Valid package names are:" >&2
  echo "$VALID_PACKAGES" | sed 's/^/ * /' >&2
  exit 1
fi