#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Cypress tests in parallel with cypress-split"
echo "Current directory: $(pwd)"

# Try running cypress-split through npm script or directly with node
if [ -f "node_modules/cypress-split/bin/run.js" ]; then
    echo "Running cypress-split via node"
    node node_modules/cypress-split/bin/run.js run \
      --ci-build-id "${GITHUB_RUN_ID}" \
      --parallel \
      --group "Machine ${SPLIT_MACHINE_INDEX}" \
      "$@"
else
    echo "ERROR: cypress-split run script not found"
    echo "Trying alternative approach..."
    
    # Try running cypress directly with cypress-split plugin
    npx cypress run \
      --env split=true,ciBuildId="${GITHUB_RUN_ID}",splitTotal="${SPLIT_TOTAL_MACHINES}",splitIndex="${SPLIT_MACHINE_INDEX}" \
      --parallel \
      --group "Machine ${SPLIT_MACHINE_INDEX}" \
      "$@"
fi

# Pass the exit code of the Cypress command.
exit $?