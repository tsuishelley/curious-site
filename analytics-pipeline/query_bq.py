"""
Claude's query interface for BigQuery.
Claude calls this script with a SQL query to get marketing data.

Usage: python query_bq.py "SELECT ..."
       python query_bq.py --schema          (print table schemas)
       python query_bq.py --tables          (list available tables)
"""
import sys
import json
from google.cloud import bigquery
import config

BQ = bigquery.Client(project=config.GCP_PROJECT_ID)
DATASET = f"{config.GCP_PROJECT_ID}.{config.BIGQUERY_DATASET}"

SCHEMA_DOCS = """
Available tables in {dataset}:

ads_campaigns — Daily Google Ads campaign performance
  date, campaign_id, campaign_name, campaign_type (SEARCH|DISPLAY),
  impressions, clicks, cost_micros (divide by 1M for $), conversions,
  conversion_value, average_cpc_micros, ctr

ads_keywords — Daily keyword performance
  date, campaign_id, campaign_name, ad_group_id, ad_group_name,
  keyword_id, keyword_text, match_type (EXACT|PHRASE|BROAD),
  impressions, clicks, cost_micros, conversions, average_cpc_micros, quality_score

ads_search_terms — Actual search queries that triggered your ads
  date, campaign_id, campaign_name, ad_group_id, ad_group_name,
  keyword_text (matched keyword), search_term (actual query),
  match_type, impressions, clicks, cost_micros, conversions

ads_ads — Ad-level performance including landing page URLs
  date, campaign_id, campaign_name, ad_group_id, ad_id, ad_type,
  final_url (landing page), headline_1, headline_2, description,
  impressions, clicks, cost_micros, conversions

ga4_sessions — Sessions by source/medium/campaign/landing page
  date, source, medium, campaign, landing_page,
  sessions, engaged_sessions, bounce_rate, avg_session_duration_sec,
  screen_page_views, new_users

ga4_conversions — Conversion events by source/campaign/landing page
  date, source, medium, campaign, landing_page, event_name, conversions

search_console_queries — SEO: queries driving organic traffic
  date, query, page, country, device,
  clicks, impressions, ctr, position

search_console_pages — SEO: page-level organic performance
  date, page, country, device,
  clicks, impressions, ctr, position

Notes:
- cost_micros: divide by 1,000,000 to get dollars
- Ads data lags 1 day; Search Console lags 3 days
- For paid search: source='google', medium='cpc'
- For display retargeting: campaign_type='DISPLAY' in ads_campaigns
- HubSpot data (leads, MQL, SQL, meetings, emails) available via HubSpot MCP
"""


def run_query(sql: str) -> str:
    try:
        job = BQ.query(sql)
        rows = list(job.result())
        if not rows:
            return json.dumps({"rows": [], "count": 0})
        data = [dict(row) for row in rows]
        # Convert non-serializable types
        for row in data:
            for k, v in row.items():
                if hasattr(v, "isoformat"):
                    row[k] = v.isoformat()
        return json.dumps({"rows": data, "count": len(data)}, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python query_bq.py \"SELECT ...\"")
        print("       python query_bq.py --schema")
        print("       python query_bq.py --tables")
        sys.exit(1)

    arg = sys.argv[1]

    if arg == "--schema":
        print(SCHEMA_DOCS.format(dataset=DATASET))
    elif arg == "--tables":
        tables = list(BQ.list_tables(f"{config.GCP_PROJECT_ID}.{config.BIGQUERY_DATASET}"))
        for t in tables:
            print(t.table_id)
    else:
        print(run_query(arg))
