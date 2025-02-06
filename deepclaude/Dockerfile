# Use the official Rust image as the base image
FROM rust:1.75 as builder

# Set the working directory
WORKDIR /usr/src/deepclaude

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY src ./src

# Build the application in release mode
RUN cargo build --release

# Create a new stage with a minimal image
FROM debian:bullseye-slim

# Set the working directory
WORKDIR /usr/local/bin

# Copy the built executable from the builder stage
COPY --from=builder /usr/src/deepclaude/target/release/deepclaude .

# Copy the configuration file
COPY config.toml .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV RUST_LOG=info
ENV DEEPSEEK_API_KEY=""
ENV ANTHROPIC_API_KEY=""

# Run the binary
CMD ["./deepclaude"]

