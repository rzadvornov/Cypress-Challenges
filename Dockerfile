# Use official Cypress image
FROM cypress/included:15.1.0

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

# Set environment variables with defaults
ARG CYPRESS_RECORD_KEY=""
ARG PERCY_TOKEN=""
ARG GITHUB_TOKEN=""
ARG PARALLEL=1
ARG MACHINE=1

# Expose environment variables
ENV CYPRESS_RECORD_KEY=${CYPRESS_RECORD_KEY}
ENV PERCY_TOKEN=${PERCY_TOKEN}
ENV GITHUB_TOKEN=${GITHUB_TOKEN}
ENV CYPRESS_PARALLEL=${PARALLEL}
ENV MACHINE_NUMBER=${MACHINE}

# Command to run tests
CMD ["sh", "-c", "npx cypress run --record --parallel --ci-build-id ${GITHUB_RUN_ID} --group \"Cypress Parallel Tests\" --browser chrome || true"]