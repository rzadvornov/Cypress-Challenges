#!/bin/bash
set -e

echo "Running Cypress tests with Cypress Cloud parallelization"
echo "CI Build ID: $CI_BUILD_ID"

# Run cypress with record flag - Cypress Cloud will handle parallelization
npx cypress run --record --key "$CYPRESS_RECORD_KEY" --ci-build-id "$CI_BUILD_ID"

exit $?