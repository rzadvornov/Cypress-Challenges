#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"

# The npm exec command is a more robust way to run package executables.
# This script explicitly uses the environment variables to split the tests.
npx cypress-split run \
  --ci-build-id ${GITHUB_RUN_ID} \
  --parallel \
  --record false \
  --group "Machine ${SPLIT_MACHINE_INDEX}" \
  "$@"

# Pass the exit code of the Cypress command.
# This ensures the CI job fails if any tests fail.
exit $?