import os
import logging
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
from pathlib import Path

# load environment variables from the repository root .env file
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

# configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def get_database_url():
    """get database URL from environment variable."""

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    logger.info("Database URL configured")
    return db_url


def get_data_dir() -> str:
    """resolve the source data directory for Docker and local execution."""

    configured_data_dir = os.getenv("DATA_DIR")
    if configured_data_dir:
        return configured_data_dir

    docker_data_dir = "/app/datasources"
    if os.path.exists(docker_data_dir):
        return docker_data_dir

    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "datasources"))


def read_csv_files(data_dir: str | None = None) -> dict:
    """load CSV files into pandas DataFrames."""

    data_dir = data_dir or get_data_dir()
    logger.info(f"Loading CSV files from {data_dir}")
    
    dataframes = {}
    
    # extract and transform cocoa global price
    cocoa_price_path = os.path.join(data_dir, "cocoa_global_price.csv")
    if os.path.exists(cocoa_price_path):
        df_cocoa = pd.read_csv(cocoa_price_path)
        df_cocoa["observation_date"] = pd.to_datetime(df_cocoa["observation_date"])
        dataframes["cocoa_global_price"] = df_cocoa
        logger.info(f"Loaded cocoa_global_price.csv with {len(df_cocoa)} rows")
    else:
        logger.warning(f"File not found: {cocoa_price_path}")
    
    # extract and transform producer price index
    ppi_path = os.path.join(data_dir, "producer_price_index.csv")
    if os.path.exists(ppi_path):
        df_ppi = pd.read_csv(ppi_path)
        df_ppi["observation_date"] = pd.to_datetime(df_ppi["observation_date"])
        dataframes["producer_price_index"] = df_ppi
        logger.info(f"Loaded producer_price_index.csv with {len(df_ppi)} rows")
    else:
        logger.warning(f"File not found: {ppi_path}")
    
    return dataframes


def build_yearly_data(dataframes: dict) -> pd.DataFrame:
    """aggregate source data into a yearly summary table."""

    if "cocoa_global_price" not in dataframes or "producer_price_index" not in dataframes:
        raise ValueError("Both source data files are required to build yearly data")

    cocoa_yearly = (
        dataframes["cocoa_global_price"]
        .assign(year=dataframes["cocoa_global_price"]["observation_date"].dt.year)
        .groupby("year", as_index=False)["PCOCOUSDM"]
        .mean()
        .rename(columns={"PCOCOUSDM": "cocoa_price"})
    )

    ppi_yearly = (
        dataframes["producer_price_index"]
        .assign(year=dataframes["producer_price_index"]["observation_date"].dt.year)
        .groupby("year", as_index=False)["PCU3113513113517"]
        .mean()
        .rename(columns={"PCU3113513113517": "ppi"})
    )

    yearly = (
        cocoa_yearly.merge(ppi_yearly, on="year", how="outer")
        .sort_values("year")
        .reset_index(drop=True)
    )

    yearly["cocoa_price_change"] = yearly["cocoa_price"].diff()
    yearly["cocoa_price_pct_change"] = yearly["cocoa_price"].pct_change() * 100
    yearly["ppi_change"] = yearly["ppi"].diff()
    yearly["ppi_pct_change"] = yearly["ppi"].pct_change() * 100

    reference_ppi_series = yearly.loc[yearly["year"] == 2011, "ppi"].dropna()
    if not reference_ppi_series.empty and reference_ppi_series.iloc[0] != 0:
        reference_ppi = float(reference_ppi_series.iloc[0])
    else:
        reference_ppi = 100.0
    yearly["ppi_pct_change_reference"] = ((yearly["ppi"] - reference_ppi) / reference_ppi) * 100

    return yearly[
        [
            "year",
            "cocoa_price",
            "cocoa_price_change",
            "cocoa_price_pct_change",
            "ppi",
            "ppi_change",
            "ppi_pct_change",
            "ppi_pct_change_reference",
        ]
    ]


def load_to_postgres(dataframes: dict, db_url: str):
    """load DataFrames into PostgreSQL."""
    
    try:
        # create engine with NullPool to avoid connection issues
        engine = create_engine(db_url, poolclass=NullPool)
        
        # test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL")
        
        # load each DataFrame into a table
        for table_name, df in dataframes.items():
            logger.info(f"Loading data into table: {table_name}")
            df.to_sql(
                table_name,
                engine,
                if_exists="replace",  # Replace if table exists
                index=False,
                method="multi",
                chunksize=1000
            )
            logger.info(f"Successfully loaded {len(df)} rows into {table_name}")

        yearly_data = build_yearly_data(dataframes)
        logger.info("Loading data into table: yearly_data")
        yearly_data.to_sql(
            "yearly_data",
            engine,
            if_exists="replace",
            index=False,
            method="multi",
            chunksize=1000,
        )
        logger.info(f"Successfully loaded {len(yearly_data)} rows into yearly_data")
        
        engine.dispose()
        logger.info("ETL process completed successfully")
        
    except Exception as e:
        logger.error(f"Error loading data to PostgreSQL: {str(e)}")
        raise


def main():
    logger.info("Starting ETL process")
    
    try:
        # get database URL
        db_url = get_database_url()
        
        # read CSV files
        df = read_csv_files()
        
        if not df:
            logger.warning("No data read from CSV files")
            return
        
        # load to PostgreSQL
        load_to_postgres(df, db_url)
        
        logger.info("ETL process finished successfully")
        
    except Exception as e:
        logger.error(f"ETL process failed: {str(e)}")
        raise


if __name__ == "__main__":
    main()
