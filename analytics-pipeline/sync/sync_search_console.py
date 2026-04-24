"""
Pulls Google Search Console query and page performance into BigQuery.

Usage: python sync/sync_search_console.py
"""
import sys
sys.path.append("..")

from datetime import date, timedelta
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.cloud import bigquery
import pandas as pd
import config

BQ = bigquery.Client(project=config.GCP_PROJECT_ID)
DATASET = f"{config.GCP_PROJECT_ID}.{config.BIGQUERY_DATASET}"
SITE_URL = config.SEARCH_CONSOLE_SITE_URL

# Search Console data lags ~2-3 days
start_date = (date.today() - timedelta(days=config.LOOKBACK_DAYS)).isoformat()
end_date = (date.today() - timedelta(days=3)).isoformat()

creds = Credentials(
    token=None,
    refresh_token=config.SC_REFRESH_TOKEN,
    client_id=config.SC_CLIENT_ID,
    client_secret=config.SC_CLIENT_SECRET,
    token_uri="https://oauth2.googleapis.com/token",
)
SC = build("searchconsole", "v1", credentials=creds)


def upsert(table: str, df: pd.DataFrame):
    table_id = f"{DATASET}.{table}"
    BQ.query(
        f"DELETE FROM `{table_id}` WHERE date BETWEEN '{start_date}' AND '{end_date}'"
    ).result()
    job = BQ.load_table_from_dataframe(df, table_id)
    job.result()
    print(f"  {table}: {len(df)} rows loaded")


def fetch_all(dimensions: list, row_limit: int = 25000) -> list:
    """Paginate through Search Console API results."""
    all_rows = []
    start_row = 0
    while True:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": dimensions,
            "rowLimit": row_limit,
            "startRow": start_row,
        }
        response = SC.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
        rows = response.get("rows", [])
        if not rows:
            break
        all_rows.extend(rows)
        if len(rows) < row_limit:
            break
        start_row += row_limit
    return all_rows


def sync_queries():
    print("Syncing Search Console queries...")
    rows = fetch_all(["date", "query", "page", "country", "device"])

    data = []
    for r in rows:
        keys = r["keys"]
        data.append({
            "date": keys[0],
            "query": keys[1],
            "page": keys[2],
            "country": keys[3],
            "device": keys[4],
            "clicks": int(r["clicks"]),
            "impressions": int(r["impressions"]),
            "ctr": r["ctr"],
            "position": r["position"],
        })

    upsert("search_console_queries", pd.DataFrame(data))


def sync_pages():
    print("Syncing Search Console pages...")
    rows = fetch_all(["date", "page", "country", "device"])

    data = []
    for r in rows:
        keys = r["keys"]
        data.append({
            "date": keys[0],
            "page": keys[1],
            "country": keys[2],
            "device": keys[3],
            "clicks": int(r["clicks"]),
            "impressions": int(r["impressions"]),
            "ctr": r["ctr"],
            "position": r["position"],
        })

    upsert("search_console_pages", pd.DataFrame(data))


if __name__ == "__main__":
    print(f"Syncing Search Console: {start_date} → {end_date}")
    sync_queries()
    sync_pages()
    print("Done.")
