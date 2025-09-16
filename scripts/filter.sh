#!/bin/bash

COMMAND="$1"
PACKAGE="$2"
ARGS="${@:3}"

VALID_PACKAGES=$(ls ./packages)

filter() {
  pnpm --filter "@instructure.ai/$PACKAGE" "$COMMAND" $ARGS
}

copy_shared_files() {
  cp -R ./public/* ./dist/
}

list_packages() {
  echo "Valid package names are:"
  ls ./packages | sed 's/^/ * /'
  echo
}

list_commands() {
  echo "Valid commands are:"
  for cmd in "${COMMANDS[@]}"; do
    echo " * $cmd"
  done
  echo
}

help() {
  echo "Usage: $0 {dev|build} <package-name> [additional-args]"
  echo "Commands:"
  echo "  dev <package-name>       Start development server for the specified package"
  echo "  build [package-name]     Build all packages or a specific package"
  echo "  preview [package-name]   Preview all packages or a specific package"
  echo "  typecheck [package-name]  Typecheck all packages or a specific package"
  list_packages
}

dev() {
    if [ -z "$PACKAGE" ]; then
    echo "Error: No package name provided for 'dev'." >&2
    list_packages
    exit 1
  fi
  if echo "$VALID_PACKAGES" | grep -qx "$PACKAGE"; then
    filter
  else
    echo -e "Error: '$PACKAGE' is not a valid package." >&2
    list_packages
    exit 1
  fi
}

build() {
  if [ -z "$PACKAGE" ]; then
    copy_shared_files
    pnpm -r build
  elif echo "$VALID_PACKAGES" | grep -qx "$PACKAGE"; then
    filter
  else
    echo -e "Error: '$PACKAGE' is not a valid package." >&2
    list_packages
    exit 1
  fi
}

preview() {
  if [ -z "$PACKAGE" ]; then
    copy_shared_files
    pnpm -r build
    pnpm preview $ARGS
  elif echo "$VALID_PACKAGES" | grep -qx "$PACKAGE"; then
      copy_shared_files
    pnpm --filter "@instructure.ai/$PACKAGE" build
    filter
  else
    echo -e "Error: '$PACKAGE' is not a valid package." >&2
    list_packages
    exit 1
  fi
}

typecheck() {
  if [ -z "$PACKAGE" ]; then
    pnpm -r typecheck
  elif echo "$VALID_PACKAGES" | grep -qx "$PACKAGE"; then
    filter
  else
    echo -e "Error: '$PACKAGE' is not a valid package." >&2
    list_packages
    exit 1
  fi
}

COMMANDS=("dev" "build" "preview" "typecheck")
case "$COMMAND" in
  dev)
    $COMMAND
    ;;
  build)
    $COMMAND
    ;;
  preview)
    $COMMAND
    ;;
  *)
    echo "Error: Unknown command '$COMMAND'." >&2
    list_commands
    help
    exit 2
    ;;
esac

exit 0