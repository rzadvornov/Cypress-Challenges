#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"
echo "Environment variables:"
echo "SPLIT=$SPLIT"
echo "CI_BUILD_ID=$CI_BUILD_ID"
echo "SPLIT_TOTAL=$SPLIT_TOTAL"
echo "SPLIT_INDEX=$SPLIT_INDEX"

# Use node to run the cypress-split run script directly
if [ "$SPLIT" = "true" ] && [ -n "$CI_BUILD_ID" ]; then
    echo "Using cypress-split for parallel execution"
    node node_modules/cypress-split/bin/run.js run \
      --ci-build-id "$CI_BUILD_ID" \
      --parallel \
      --group "Machine ${SPLIT_INDEX}" \
      "$@"
else
    echo "Running regular Cypress (no parallel split)"
    npx cypress run "$@"
fi

# Pass the exit code of the Cypress command.
exit $?