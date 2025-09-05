#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"
echo "Environment variables:"
echo "SPLIT=$SPLIT"
echo "CI_BUILD_ID=$CI_BUILD_ID"
echo "SPLIT_TOTAL=$SPLIT_TOTAL"
echo "SPLIT_INDEX=$SPLIT_INDEX"

# Debug: Show what's in the cypress-split package
echo "=== Debug: cypress-split package structure ==="
find node_modules/cypress-split -name "*.js" -type f | head -20
echo "=== Node modules bin contents ==="
ls -la node_modules/.bin/ | grep cypress-split

# The correct approach: use regular cypress run with environment variables
# cypress-split works as a plugin, not a standalone CLI
echo "Using Cypress with cypress-split plugin via environment variables"
npx cypress run \
  --parallel \
  --group "Machine ${SPLIT_INDEX}" \
  "$@"

# Pass the exit code of the Cypress command.
exit $?