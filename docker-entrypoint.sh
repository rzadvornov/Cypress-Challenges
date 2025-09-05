#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"

# The most reliable way to run a local executable is by using its full path.
./node_modules/.bin/cypress-split run \
  --ci-build-id "${GITHUB_RUN_ID}" \
  --parallel \
  --group "Machine ${SPLIT_MACHINE_INDEX}" \
  "$@"

# Pass the exit code of the Cypress command.
# This ensures the CI job fails if any tests fail.
exit $?