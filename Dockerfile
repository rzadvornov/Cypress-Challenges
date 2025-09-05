# Use official Cypress image
FROM cypress/included:14.5.4

# Set working directory
WORKDIR /e2e

# Install global dependencies
RUN npm install -g @percy/cli cypress-split

# Copy package files
COPY package*.json ./
COPY .cypress-cucumber-preprocessorrc.json ./

# Install project dependencies
RUN npm ci

# Copy test files
COPY . .

# Create a non-root user to run the tests
RUN groupadd -r cypress && useradd -r -g cypress -m -d /e2e cypress \
    && chown -R cypress:cypress /e2e

# Switch to non-root user
USER cypress

# Create an entrypoint script to handle environment variables properly
COPY --chown=cypress:cypress docker-entrypoint.sh /e2e/docker-entrypoint.sh
RUN chmod +x /e2e/docker-entrypoint.sh

# Use the entrypoint script
ENTRYPOINT ["/e2e/docker-entrypoint.sh"]