#!/bin/bash

# Add locally installed node_modules/.bin to the path
# Run with "source ./package.sh"
export PATH="$PATH:$(npm bin)"
