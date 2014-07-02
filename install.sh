#!/bin/bash
npm install co debug q
for module in ./modules/*; do
  npm install ${module}
done
