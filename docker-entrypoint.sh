#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"
echo "Current directory: $(pwd)"
echo "Node modules bin contents:"
ls -la node_modules/.bin/ || echo "Cannot list node_modules/.bin"

# Use the direct path with proper error handling
if [ -f "./node_modules/.bin/cypress-split" ]; then
    echo "cypress-split found at ./node_modules/.bin/cypress-split"
    ./node_modules/.bin/cypress-split run \
      --ci-build-id "${GITHUB_RUN_ID}" \
      --parallel \
      --group "Machine ${SPLIT_MACHINE_INDEX}" \
      "$@"
else
    echo "ERROR: cypress-split not found at ./node_modules/.bin/cypress-split"
    echo "Trying with npx..."
    npx cypress-split run \
      --ci-build-id "${GITHUB_RUN_ID}" \
      --parallel \
      --group "Machine ${SPLIT_MACHINE_INDEX}" \
      "$@"
fi

# Pass the exit code of the Cypress command.
exit $?