# RateMyProfessors.dev

By Raymond Lin (danknessdra) and David Le (pynappo)

This is a MVP for a [RateMyProfessors.com](https://ratemyprofessors.com) website that dynamically scrapes data from RMP and lets users search over it with Elasticsearch.

## Running:

start docker
```bash
docker compose build
docker compose up
```

populate elasticsearch
```bash
cd data_population
python -m venv .venv
source .venv/bin/activate
python scrape_schools_to_elasticsearch.py
```

- Frontend: localhost:3000
- ElasticSearch Kibana: localhost:5601
- ElasticSearch: localhost:9200
