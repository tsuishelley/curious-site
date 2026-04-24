"""
Pulls Google Ads campaign, keyword, search term, and ad performance
into BigQuery. Deletes and rewrites the lookback window each run (idempotent).

Usage: python sync/sync_ads.py
"""
import sys
sys.path.append("..")

from datetime import date, timedelta
from google.ads.googleads.client import GoogleAdsClient
from google.cloud import bigquery
import pandas as pd
import config

BQ = bigquery.Client(project=config.GCP_PROJECT_ID)
DATASET = f"{config.GCP_PROJECT_ID}.{config.BIGQUERY_DATASET}"
CUSTOMER_ID = config.GOOGLE_ADS_CUSTOMER_ID

ads_config = {
    "developer_token": config.GOOGLE_ADS_DEVELOPER_TOKEN,
    "client_id": config.GOOGLE_ADS_CLIENT_ID,
    "client_secret": config.GOOGLE_ADS_CLIENT_SECRET,
    "refresh_token": config.GOOGLE_ADS_REFRESH_TOKEN,
    "login_customer_id": CUSTOMER_ID,
    "use_proto_plus": True,
}
ADS = GoogleAdsClient.load_from_dict(ads_config)

start_date = (date.today() - timedelta(days=config.LOOKBACK_DAYS)).isoformat()
end_date = (date.today() - timedelta(days=1)).isoformat()  # Ads data lags 1 day


def run_query(gaql: str) -> list:
    service = ADS.get_service("GoogleAdsService")
    response = service.search_stream(customer_id=CUSTOMER_ID, query=gaql)
    rows = []
    for batch in response:
        for row in batch.results:
            rows.append(row)
    return rows


def upsert(table: str, df: pd.DataFrame):
    table_id = f"{DATASET}.{table}"
    # Delete existing rows for the date range, then insert fresh
    BQ.query(
        f"DELETE FROM `{table_id}` WHERE date BETWEEN '{start_date}' AND '{end_date}'"
    ).result()
    job = BQ.load_table_from_dataframe(df, table_id)
    job.result()
    print(f"  {table}: {len(df)} rows loaded")


def sync_campaigns():
    print("Syncing campaigns...")
    rows = run_query(f"""
        SELECT
            segments.date,
            campaign.id,
            campaign.name,
            campaign.advertising_channel_type,
            campaign.status,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversions_value,
            metrics.average_cpc,
            metrics.ctr
        FROM campaign
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
          AND campaign.status != 'REMOVED'
    """)

    data = []
    for r in rows:
        data.append({
            "date": r.segments.date,
            "campaign_id": str(r.campaign.id),
            "campaign_name": r.campaign.name,
            "campaign_type": r.campaign.advertising_channel_type.name,
            "status": r.campaign.status.name,
            "impressions": r.metrics.impressions,
            "clicks": r.metrics.clicks,
            "cost_micros": r.metrics.cost_micros,
            "conversions": r.metrics.conversions,
            "conversion_value": r.metrics.conversions_value,
            "average_cpc_micros": int(r.metrics.average_cpc),
            "ctr": r.metrics.ctr,
            "average_position": 0.0,
        })

    upsert("ads_campaigns", pd.DataFrame(data))


def sync_keywords():
    print("Syncing keywords...")
    rows = run_query(f"""
        SELECT
            segments.date,
            campaign.id,
            campaign.name,
            ad_group.id,
            ad_group.name,
            ad_group_criterion.criterion_id,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.average_cpc,
            ad_group_criterion.quality_info.quality_score
        FROM keyword_view
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
          AND ad_group_criterion.status != 'REMOVED'
    """)

    data = []
    for r in rows:
        data.append({
            "date": r.segments.date,
            "campaign_id": str(r.campaign.id),
            "campaign_name": r.campaign.name,
            "ad_group_id": str(r.ad_group.id),
            "ad_group_name": r.ad_group.name,
            "keyword_id": str(r.ad_group_criterion.criterion_id),
            "keyword_text": r.ad_group_criterion.keyword.text,
            "match_type": r.ad_group_criterion.keyword.match_type.name,
            "status": r.ad_group_criterion.status.name,
            "impressions": r.metrics.impressions,
            "clicks": r.metrics.clicks,
            "cost_micros": r.metrics.cost_micros,
            "conversions": r.metrics.conversions,
            "average_cpc_micros": int(r.metrics.average_cpc),
            "quality_score": r.ad_group_criterion.quality_info.quality_score or 0,
        })

    upsert("ads_keywords", pd.DataFrame(data))


def sync_search_terms():
    print("Syncing search terms...")
    rows = run_query(f"""
        SELECT
            segments.date,
            campaign.id,
            campaign.name,
            ad_group.id,
            ad_group.name,
            segments.keyword.info.text,
            search_term_view.search_term,
            segments.keyword.info.match_type,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
        FROM search_term_view
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
    """)

    data = []
    for r in rows:
        data.append({
            "date": r.segments.date,
            "campaign_id": str(r.campaign.id),
            "campaign_name": r.campaign.name,
            "ad_group_id": str(r.ad_group.id),
            "ad_group_name": r.ad_group.name,
            "keyword_text": r.segments.keyword.info.text,
            "search_term": r.search_term_view.search_term,
            "match_type": r.segments.keyword.info.match_type.name,
            "impressions": r.metrics.impressions,
            "clicks": r.metrics.clicks,
            "cost_micros": r.metrics.cost_micros,
            "conversions": r.metrics.conversions,
        })

    upsert("ads_search_terms", pd.DataFrame(data))


def sync_ads():
    print("Syncing ads...")
    rows = run_query(f"""
        SELECT
            segments.date,
            campaign.id,
            campaign.name,
            ad_group.id,
            ad_group_ad.ad.id,
            ad_group_ad.ad.type,
            ad_group_ad.ad.final_urls,
            ad_group_ad.ad.responsive_search_ad.headlines,
            ad_group_ad.ad.responsive_search_ad.descriptions,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
        FROM ad_group_ad
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
          AND ad_group_ad.status != 'REMOVED'
    """)

    data = []
    for r in rows:
        ad = r.ad_group_ad.ad
        headlines = ad.responsive_search_ad.headlines
        descriptions = ad.responsive_search_ad.descriptions
        data.append({
            "date": r.segments.date,
            "campaign_id": str(r.campaign.id),
            "campaign_name": r.campaign.name,
            "ad_group_id": str(r.ad_group.id),
            "ad_id": str(ad.id),
            "ad_type": ad.type_.name,
            "final_url": ad.final_urls[0] if ad.final_urls else "",
            "headline_1": headlines[0].text if len(headlines) > 0 else "",
            "headline_2": headlines[1].text if len(headlines) > 1 else "",
            "description": descriptions[0].text if descriptions else "",
            "impressions": r.metrics.impressions,
            "clicks": r.metrics.clicks,
            "cost_micros": r.metrics.cost_micros,
            "conversions": r.metrics.conversions,
        })

    upsert("ads_ads", pd.DataFrame(data))


if __name__ == "__main__":
    print(f"Syncing Google Ads: {start_date} → {end_date}")
    sync_campaigns()
    sync_keywords()
    sync_search_terms()
    sync_ads()
    print("Done.")
