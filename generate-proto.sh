#!/bin/bash

# Create necessary directories
mkdir -p proto/generated

# Generate TypeScript types using proto-loader-gen-types
yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto/generated proto/*.proto

echo "Generated TypeScript types from proto files"