#!/bin/bash
jq -c -r ".[]" professordata.json | while read line; do echo "{\"index\":{ \"_index\" : \"sjsu_professors\"}}"; echo $line; done > bulk.json
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@bulk.json"; echo