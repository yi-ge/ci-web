#!/bin/bash
if [ $1 ]; then
  git add .
  git commit -m "update - `date '+%Y-%m-%d %T'`"
  git push
else
  git add .
  git commit -m "update - `date '+%Y-%m-%d %T'`"
  git push
fi
