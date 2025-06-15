#!/bin/bash

# Create necessary directories
mkdir -p src/generated

# Generate TypeScript types using proto-loader-gen-types
yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=src/generated proto/*.proto

echo "Generated TypeScript types from proto files"