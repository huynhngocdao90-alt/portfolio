#!/bin/bash
set -e

cd ..
git add .
git commit -m "updated"
git push origin main
