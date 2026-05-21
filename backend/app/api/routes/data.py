from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.data import YearlyDataPoint
from app.services.data_service import get_yearly_data


router = APIRouter(prefix="/api/data", tags=["data"])


# get aggregated yearly data for visualization
@router.get("/yearly", response_model=List[YearlyDataPoint])
async def get_yearly_visualization_data(db: Session = Depends(get_db)):
    try:
        return get_yearly_data(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving data: {str(e)}",
        )
