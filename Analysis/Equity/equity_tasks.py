from Redis.classes import Redis
from Analysis.Equity.stock_index import top_10_tickers
from Analysis.Equity.classes import *
from celery import shared_task
from django.conf import settings
from Analysis.Equity.indicator_list import indicator_list

import datetime
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async


def populate_historic_data():
    if settings.COLLECT_HISTORICAL_DATA:
        for ticker in top_10_tickers:
            equity = EquityData(ticker=ticker)
            # saves an equity's historic data within redis
            equity.set_historic_data()

    else:
        print(f"settings.COLLECT_HISTORICAL_DATA is {settings.COLLECT_HISTORICAL_DATA}")

# called at the pre-market open of the next day.
# this appends an equity's historical data with yesterday's data.


@shared_task
def update_historic_data_with_previous_day_data():
    for ticker in top_10_tickers:
        equity = EquityData(ticker=ticker)
        # updates the equity's historical data with the previous day's data
        equity.set_previous_day_data()


@shared_task
def update_intraday_data():
    # Check if market is closed or open. 9:30 AM -
    for ticker in top_10_tickers:
        equity = EquityData(ticker=ticker)
        # saves an equity's intraday data within redis
        equity.set_intraday_data()

        # update intraday data for connected clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"{ticker}-intraday",
            {
                "type": "websocket.update",
                "text": equity.get_intraday_data()
            }
        )