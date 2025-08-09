from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests


@api_view(["GET"])
def search(request):
    query = request.query_params.get("query", "")
    try:
        resp = requests.get("https://api.crossref.org/works", params={"query": query}, timeout=10)
        resp.raise_for_status()
        items = resp.json().get("message", {}).get("items", [])
    except requests.RequestException:
        items = []
    results = []
    for item in items:
        authors = [
            f"{a.get('given', '')} {a.get('family', '')}".strip()
            for a in item.get("author", [])
            if a.get("given") or a.get("family")
        ]
        published = item.get("published-print") or item.get("published-online") or {}
        year = None
        if "date-parts" in published and published["date-parts"]:
            year = published["date-parts"][0][0]
        results.append(
            {
                "title": item.get("title", [""])[0],
                "doi": item.get("DOI"),
                "url": item.get("URL"),
                "authors": authors,
                "year": year,
            }
        )

    return Response({"results": results})


@api_view(["POST"])
def export_mermaid(request):
    nodes = request.data.get("nodes", [])
    edges = request.data.get("edges", [])
    lines = ["graph TD"]
    for node in nodes:
        lines.append(f"    {node['id']}[{node['label']}]")
    for edge in edges:
        lines.append(f"    {edge['source']} --> {edge['target']}")
    return Response({"mermaid": "\n".join(lines)})

