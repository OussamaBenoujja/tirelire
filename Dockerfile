FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json (and package-lock.json if exists)
COPY package.json package-lock.json* ./

# Install dependencies (nodemon included)
RUN npm install --global nodemon && npm install

# Copy all source code
COPY ./src ./src

# Expose the port
EXPOSE 3000

# Start the app using nodemon
CMD ["nodemon", "src/app.js"]
