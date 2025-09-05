#!/bin/bash
set -e

echo "Running Cypress tests with Cypress Cloud parallelization"
echo "CI Build ID: $CI_BUILD_ID"
echo "Machine Index: $SPLIT_INDEX"

# Run cypress with record, parallel, and group flags
npx cypress run \
  --record \
  --parallel \
  --group "Machine ${SPLIT_INDEX:-0}" \
  --key "$CYPRESS_RECORD_KEY" \
  --ci-build-id "$CI_BUILD_ID"

exit $?