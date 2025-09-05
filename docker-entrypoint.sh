#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with Cypress Cloud"
echo "Environment variables:"
echo "CI_BUILD_ID=$CI_BUILD_ID"
echo "SPLIT_INDEX=$SPLIT_INDEX"

# Run cypress with record flag for Cypress Cloud parallelization
npx cypress run \
  --record \
  --key "$CYPRESS_RECORD_KEY" \
  --parallel \
  --group "Machine ${SPLIT_INDEX}" \
  --ci-build-id "$CI_BUILD_ID" \
  "$@"

# Pass the exit code of the Cypress command.
exit $?