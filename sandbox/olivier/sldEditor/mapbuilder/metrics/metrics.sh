#!/bin/bash
ls -l `find . -type f` | sed -e"s/  */ /g"
