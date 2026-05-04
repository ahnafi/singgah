#!/bin/sh
set -e

# Buat folder yang diperlukan jika belum ada
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Set permissions (penting untuk Docker)
chown -R www-data:www-data storage bootstrap/cache

# Jalankan migration jika RUN_MIGRATIONS true
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

# Cache config & route untuk performa
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan supervisord (Nginx + PHP-FPM)
exec /usr/bin/supervisord -c /etc/supervisord.conf
