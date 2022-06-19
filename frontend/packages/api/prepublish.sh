#!/bin/sh

pnpm run build
ls dist > files.txt
cp -R dist/* ./
