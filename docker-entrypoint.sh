#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"
echo "Environment variables:"
echo "SPLIT=true"
echo "CI_BUILD_ID=$CI_BUILD_ID"
echo "SPLIT_TOTAL=$SPLIT_TOTAL"
echo "SPLIT_INDEX=$SPLIT_INDEX"

# Run cypress with record flag for Cypress Cloud parallelization
npx cypress run \
  --record \
  --parallel \
  --group "Machine ${SPLIT_INDEX}" \
  --ci-build-id "$CI_BUILD_ID" \
  "$@"

# Pass the exit code of the Cypress command.
exit $?