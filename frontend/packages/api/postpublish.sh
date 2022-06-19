#!/bin/sh

for f in $(cat files.txt) ; do 
  rm -rf "$f"
done

rm files.txt
