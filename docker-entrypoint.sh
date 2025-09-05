#!/bin/bash
set -e

# Set default values if environment variables are not set
PARALLEL=${PARALLEL:-1}
MACHINE_NUMBER=${MACHINE_NUMBER:-1}
GITHUB_RUN_ID=${GITHUB_RUN_ID:-local-run}

# Build the Cypress command
CYPRESS_CMD="npx cypress run"

# Add record option if CYPRESS_RECORD_KEY is set
if [ -n "$CYPRESS_RECORD_KEY" ]; then
    CYPRESS_CMD="$CYPRESS_CMD --record"
    
    # Add parallel option if PARALLEL > 1
    if [ "$PARALLEL" -gt 1 ]; then
        CYPRESS_CMD="$CYPRESS_CMD --parallel"
    fi
    
    # Add CI build ID
    CYPRESS_CMD="$CYPRESS_CMD --ci-build-id $GITHUB_RUN_ID"
    
    # Add group name
    CYPRESS_CMD="$CYPRESS_CMD --group \"Cypress Parallel Tests\""
fi

# Add browser option if specified
if [ -n "$BROWSER" ]; then
    CYPRESS_CMD="$CYPRESS_CMD --browser $BROWSER"
else
    CYPRESS_CMD="$CYPRESS_CMD --browser chrome"
fi

# Add additional config if specified
if [ -n "$CYPRESS_CONFIG" ]; then
    CYPRESS_CMD="$CYPRESS_CMD --config $CYPRESS_CONFIG"
fi

echo "Running command: $CYPRESS_CMD"
eval $CYPRESS_CMD

# Capture the exit code
EXIT_CODE=$?

# Always exit with the Cypress exit code
exit $EXIT_CODE