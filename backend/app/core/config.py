from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql://bigland:bigland@localhost:5432/bigland"
    cors_origins: list[str] = ["http://localhost:5173"]
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_prefix="BIGLAND_")


settings = Settings()
