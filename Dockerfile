# Start from the PostGIS image which already includes PostGIS extension
FROM postgis/postgis:17-3.5

# Install pgvector extension
RUN apt-get update && \
    apt-get install -y postgresql-17-pgvector && \
    rm -rf /var/lib/apt/lists/*

# Enable the pgvector and postgis extensions
# These commands will be run each time a new database is created
RUN echo "CREATE EXTENSION IF NOT EXISTS postgis;" >> /docker-entrypoint-initdb.d/init_extensions.sql && \
    echo "CREATE EXTENSION IF NOT EXISTS vector;" >> /docker-entrypoint-initdb.d/init_extensions.sql

# Expose PostgreSQL port
EXPOSE 5432