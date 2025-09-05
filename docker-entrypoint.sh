#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"
echo "Environment variables:"
echo "SPLIT=$SPLIT"
echo "CI_BUILD_ID=$CI_BUILD_ID"
echo "SPLIT_TOTAL=$SPLIT_TOTAL"
echo "SPLIT_INDEX=$SPLIT_INDEX"

# Run regular cypress command - cypress-split plugin will handle parallelization
# WITHOUT using --parallel or --group flags (those are for Cypress Cloud)
npx cypress run "$@"

# Pass the exit code of the Cypress command.
exit $?