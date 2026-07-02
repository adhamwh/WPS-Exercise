#!/bin/bash

php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan l5-swagger:generate || exit 1
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link || true

apache2-foreground
