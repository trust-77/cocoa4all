from typing import List

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.data import YearlyDataPoint


def get_yearly_data(db: Session) -> List[YearlyDataPoint]:
    query = db.execute(text("""
        SELECT
            year,
            cocoa_price,
            cocoa_price_change,
            cocoa_price_pct_change,
            ppi,
            ppi_change,
            ppi_pct_change,
            ppi_pct_change_reference
        FROM yearly_data
        ORDER BY year
    """))

    return [
        YearlyDataPoint(
            year=int(row[0]),
            cocoa_price=float(row[1]) if row[1] is not None else None,
            cocoa_price_change=float(row[2]) if row[2] is not None else None,
            cocoa_price_pct_change=float(row[3]) if row[3] is not None else None,
            ppi=float(row[4]) if row[4] is not None else None,
            ppi_change=float(row[5]) if row[5] is not None else None,
            ppi_pct_change=float(row[6]) if row[6] is not None else None,
            ppi_pct_change_reference=float(row[7]) if row[7] is not None else None,
        )
        for row in query
    ]
