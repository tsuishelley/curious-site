"""
Run once to create the BigQuery dataset and all tables.
Usage: python setup_bigquery.py
"""
from google.cloud import bigquery
import config

client = bigquery.Client(project=config.GCP_PROJECT_ID)
dataset_ref = f"{config.GCP_PROJECT_ID}.{config.BIGQUERY_DATASET}"


def create_dataset():
    dataset = bigquery.Dataset(dataset_ref)
    dataset.location = "US"
    client.create_dataset(dataset, exists_ok=True)
    print(f"Dataset ready: {dataset_ref}")


SCHEMAS = {
    "ads_campaigns": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("campaign_id", "STRING"),
        bigquery.SchemaField("campaign_name", "STRING"),
        bigquery.SchemaField("campaign_type", "STRING"),  # SEARCH or DISPLAY
        bigquery.SchemaField("status", "STRING"),
        bigquery.SchemaField("impressions", "INTEGER"),
        bigquery.SchemaField("clicks", "INTEGER"),
        bigquery.SchemaField("cost_micros", "INTEGER"),
        bigquery.SchemaField("conversions", "FLOAT"),
        bigquery.SchemaField("conversion_value", "FLOAT"),
        bigquery.SchemaField("average_cpc_micros", "INTEGER"),
        bigquery.SchemaField("ctr", "FLOAT"),
        bigquery.SchemaField("average_position", "FLOAT"),
    ],
    "ads_keywords": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("campaign_id", "STRING"),
        bigquery.SchemaField("campaign_name", "STRING"),
        bigquery.SchemaField("ad_group_id", "STRING"),
        bigquery.SchemaField("ad_group_name", "STRING"),
        bigquery.SchemaField("keyword_id", "STRING"),
        bigquery.SchemaField("keyword_text", "STRING"),
        bigquery.SchemaField("match_type", "STRING"),
        bigquery.SchemaField("status", "STRING"),
        bigquery.SchemaField("impressions", "INTEGER"),
        bigquery.SchemaField("clicks", "INTEGER"),
        bigquery.SchemaField("cost_micros", "INTEGER"),
        bigquery.SchemaField("conversions", "FLOAT"),
        bigquery.SchemaField("average_cpc_micros", "INTEGER"),
        bigquery.SchemaField("quality_score", "INTEGER"),
    ],
    "ads_search_terms": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("campaign_id", "STRING"),
        bigquery.SchemaField("campaign_name", "STRING"),
        bigquery.SchemaField("ad_group_id", "STRING"),
        bigquery.SchemaField("ad_group_name", "STRING"),
        bigquery.SchemaField("keyword_text", "STRING"),
        bigquery.SchemaField("search_term", "STRING"),
        bigquery.SchemaField("match_type", "STRING"),
        bigquery.SchemaField("impressions", "INTEGER"),
        bigquery.SchemaField("clicks", "INTEGER"),
        bigquery.SchemaField("cost_micros", "INTEGER"),
        bigquery.SchemaField("conversions", "FLOAT"),
    ],
    "ads_ads": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("campaign_id", "STRING"),
        bigquery.SchemaField("campaign_name", "STRING"),
        bigquery.SchemaField("ad_group_id", "STRING"),
        bigquery.SchemaField("ad_id", "STRING"),
        bigquery.SchemaField("ad_type", "STRING"),
        bigquery.SchemaField("final_url", "STRING"),
        bigquery.SchemaField("headline_1", "STRING"),
        bigquery.SchemaField("headline_2", "STRING"),
        bigquery.SchemaField("description", "STRING"),
        bigquery.SchemaField("impressions", "INTEGER"),
        bigquery.SchemaField("clicks", "INTEGER"),
        bigquery.SchemaField("cost_micros", "INTEGER"),
        bigquery.SchemaField("conversions", "FLOAT"),
    ],
    "ga4_sessions": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("source", "STRING"),
        bigquery.SchemaField("medium", "STRING"),
        bigquery.SchemaField("campaign", "STRING"),
        bigquery.SchemaField("landing_page", "STRING"),
        bigquery.SchemaField("sessions", "INTEGER"),
        bigquery.SchemaField("engaged_sessions", "INTEGER"),
        bigquery.SchemaField("bounce_rate", "FLOAT"),
        bigquery.SchemaField("avg_session_duration_sec", "FLOAT"),
        bigquery.SchemaField("screen_page_views", "INTEGER"),
        bigquery.SchemaField("new_users", "INTEGER"),
    ],
    "ga4_conversions": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("source", "STRING"),
        bigquery.SchemaField("medium", "STRING"),
        bigquery.SchemaField("campaign", "STRING"),
        bigquery.SchemaField("landing_page", "STRING"),
        bigquery.SchemaField("event_name", "STRING"),
        bigquery.SchemaField("conversions", "INTEGER"),
    ],
    "search_console_queries": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("query", "STRING"),
        bigquery.SchemaField("page", "STRING"),
        bigquery.SchemaField("country", "STRING"),
        bigquery.SchemaField("device", "STRING"),
        bigquery.SchemaField("clicks", "INTEGER"),
        bigquery.SchemaField("impressions", "INTEGER"),
        bigquery.SchemaField("ctr", "FLOAT"),
        bigquery.SchemaField("position", "FLOAT"),
    ],
    "search_console_pages": [
        bigquery.SchemaField("date", "DATE"),
        bigquery.SchemaField("page", "STRING"),
        bigquery.SchemaField("country", "STRING"),
        bigquery.SchemaField("device", "STRING"),
        bigquery.SchemaField("clicks", "INTEGER"),
        bigquery.SchemaField("impressions", "INTEGER"),
        bigquery.SchemaField("ctr", "FLOAT"),
        bigquery.SchemaField("position", "FLOAT"),
    ],
}


def create_tables():
    for table_name, schema in SCHEMAS.items():
        table_id = f"{dataset_ref}.{table_name}"
        table = bigquery.Table(table_id, schema=schema)

        # Partition by date for cost-efficient querying
        table.time_partitioning = bigquery.TimePartitioning(
            type_=bigquery.TimePartitioningType.DAY,
            field="date",
        )

        client.create_table(table, exists_ok=True)
        print(f"Table ready: {table_id}")


if __name__ == "__main__":
    create_dataset()
    create_tables()
    print("\nSetup complete. Run sync scripts to populate data.")
