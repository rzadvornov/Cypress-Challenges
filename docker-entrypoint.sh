#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel on CI using cypress-split"

# The cypress-split command will handle parallelization,
# using the environment variables from the GitHub Actions workflow.
npx cypress-split run \
  --ci \
  --total "${SPLIT_TOTAL_MACHINES}" \
  --group "${SPLIT_MACHINE_INDEX}" \
  "$@"

# Pass the exit code of the Cypress command.
# This ensures the CI job fails if any tests fail.
exit $?