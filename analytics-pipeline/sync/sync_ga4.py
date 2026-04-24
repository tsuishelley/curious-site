"""
Pulls GA4 session and conversion data by source/medium/campaign/landing page
into BigQuery.

Usage: python sync/sync_ga4.py
"""
import sys
sys.path.append("..")

from datetime import date, timedelta
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange, Dimension, Metric, RunReportRequest, FilterExpression, Filter,
)
from google.oauth2.credentials import Credentials
from google.cloud import bigquery
import pandas as pd
import config

BQ = bigquery.Client(project=config.GCP_PROJECT_ID)
DATASET = f"{config.GCP_PROJECT_ID}.{config.BIGQUERY_DATASET}"

start_date = (date.today() - timedelta(days=config.LOOKBACK_DAYS)).isoformat()
end_date = (date.today() - timedelta(days=1)).isoformat()

creds = Credentials(
    token=None,
    refresh_token=config.GA4_REFRESH_TOKEN,
    client_id=config.GA4_CLIENT_ID,
    client_secret=config.GA4_CLIENT_SECRET,
    token_uri="https://oauth2.googleapis.com/token",
)
GA4 = BetaAnalyticsDataClient(credentials=creds)
PROPERTY = f"properties/{config.GA4_PROPERTY_ID}"


def upsert(table: str, df: pd.DataFrame):
    table_id = f"{DATASET}.{table}"
    BQ.query(
        f"DELETE FROM `{table_id}` WHERE date BETWEEN '{start_date}' AND '{end_date}'"
    ).result()
    job = BQ.load_table_from_dataframe(df, table_id)
    job.result()
    print(f"  {table}: {len(df)} rows loaded")


def sync_sessions():
    print("Syncing GA4 sessions...")
    request = RunReportRequest(
        property=PROPERTY,
        dimensions=[
            Dimension(name="date"),
            Dimension(name="sessionSource"),
            Dimension(name="sessionMedium"),
            Dimension(name="sessionCampaignName"),
            Dimension(name="landingPage"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="engagedSessions"),
            Metric(name="bounceRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="screenPageViews"),
            Metric(name="newUsers"),
        ],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        limit=100000,
    )
    response = GA4.run_report(request)

    data = []
    for row in response.rows:
        d = row.dimension_values
        m = row.metric_values
        # GA4 returns date as YYYYMMDD
        raw_date = d[0].value
        formatted_date = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:]}"
        data.append({
            "date": formatted_date,
            "source": d[1].value,
            "medium": d[2].value,
            "campaign": d[3].value,
            "landing_page": d[4].value,
            "sessions": int(m[0].value),
            "engaged_sessions": int(m[1].value),
            "bounce_rate": float(m[2].value),
            "avg_session_duration_sec": float(m[3].value),
            "screen_page_views": int(m[4].value),
            "new_users": int(m[5].value),
        })

    upsert("ga4_sessions", pd.DataFrame(data))


def sync_conversions():
    print("Syncing GA4 conversions...")
    request = RunReportRequest(
        property=PROPERTY,
        dimensions=[
            Dimension(name="date"),
            Dimension(name="sessionSource"),
            Dimension(name="sessionMedium"),
            Dimension(name="sessionCampaignName"),
            Dimension(name="landingPage"),
            Dimension(name="eventName"),
        ],
        metrics=[
            Metric(name="conversions"),
        ],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        # Only pull conversion events (key events in GA4)
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="isKeyEvent",
                string_filter=Filter.StringFilter(value="true"),
            )
        ),
        limit=100000,
    )
    response = GA4.run_report(request)

    data = []
    for row in response.rows:
        d = row.dimension_values
        m = row.metric_values
        raw_date = d[0].value
        formatted_date = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:]}"
        data.append({
            "date": formatted_date,
            "source": d[1].value,
            "medium": d[2].value,
            "campaign": d[3].value,
            "landing_page": d[4].value,
            "event_name": d[5].value,
            "conversions": int(m[0].value),
        })

    upsert("ga4_conversions", pd.DataFrame(data))


if __name__ == "__main__":
    print(f"Syncing GA4: {start_date} → {end_date}")
    sync_sessions()
    sync_conversions()
    print("Done.")
