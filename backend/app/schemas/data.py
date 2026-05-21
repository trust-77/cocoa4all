from typing import Optional

from pydantic import BaseModel, ConfigDict


class YearlyDataPoint(BaseModel):
    year: int
    cocoa_price: Optional[float] = None
    cocoa_price_change: Optional[float] = None
    cocoa_price_pct_change: Optional[float] = None
    ppi: Optional[float] = None
    ppi_change: Optional[float] = None
    ppi_pct_change: Optional[float] = None
    ppi_pct_change_reference: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
