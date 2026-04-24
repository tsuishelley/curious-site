#!/bin/bash
# Run all sync scripts. Called by cron nightly.
# Add to crontab: 0 6 * * * /path/to/analytics-pipeline/sync_all.sh >> /path/to/analytics-pipeline/sync.log 2>&1

set -e
cd "$(dirname "$0")"

echo "=== $(date) ==="
source .venv/bin/activate

echo "--- Google Ads ---"
python sync/sync_ads.py

echo "--- GA4 ---"
python sync/sync_ga4.py

echo "--- Search Console ---"
python sync/sync_search_console.py

echo "=== Done ==="
