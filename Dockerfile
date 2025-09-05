# Use official Cypress image
FROM cypress/included:14.5.4

# Set working directory
WORKDIR /e2e

# Install Percy CLI
RUN npm install -g @percy/cli

# Copy package files
COPY package*.json ./
COPY .cypress-cucumber-preprocessorrc.json ./

# Install dependencies
RUN npm ci

# Copy test files
COPY . .

# Set non-sensitive environment variables with defaults
ARG PARALLEL=1
ARG MACHINE=1

# Expose non-sensitive environment variables
ENV CYPRESS_PARALLEL=${PARALLEL}
ENV MACHINE_NUMBER=${MACHINE}

# Create a non-root user to run the tests
RUN groupadd -r cypress && useradd -r -g cypress -m -d /e2e cypress \
    && chown -R cypress:cypress /e2e

# Switch to non-root user
USER cypress

# Command to run tests (secrets will be passed at runtime)
CMD ["sh", "-c", "npx cypress run --record --parallel --ci-build-id ${GITHUB_RUN_ID} --group \"Cypress Parallel Tests\" --browser chrome || true"]