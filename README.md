# OpenResearchMap

Prototype implementation of **OpenLitMap** – a free and open-source platform for exploring scientific literature networks.

This repository currently contains a minimal API built with **Django REST Framework** and a simple frontend that queries the API. It demonstrates how to search articles via the CrossRef API and export small graphs to Mermaid syntax.

## Running the backend

```bash
pip install -r backend/requirements.txt
python backend/manage.py runserver
```

The server will start on `http://localhost:8000`.

## Using the frontend

Open `frontend/index.html` in a browser. It will connect to the backend and display search results in a Material UI interface with cards showing titles, authors, and publication years.

## Exporting to Mermaid

Send a `POST` request to `/api/export/mermaid` with a JSON payload containing `nodes` and `edges` to receive Mermaid graph text.

This is an early prototype; many features from the project roadmap remain to be implemented.
