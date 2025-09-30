from enum import Enum, IntEnum


class CurrencyType(Enum):
    btc = 'BTC'
    ltc = 'LTC'

class TimeType(IntEnum):
    day = 24
    week = 168
    month = 720
