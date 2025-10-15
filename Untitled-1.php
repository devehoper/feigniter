# This map block should be placed in your /etc/nginx/nginx.conf file, inside the `http` block.
# It creates a variable `$cors_origin` that will contain the allowed origin if it matches.
map $http_origin $cors_origin {
    default "";
    "~^https?://(api\.devehoper\.com|devehoper\.com|192\.168\.1\.105|desktop\.localhost)$" "$http_origin";
}

server {
    listen 80;
    listen [::]:80;
    server_name api.devehoper.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.devehoper.com;

    # SSL certificates from Certbot
    ssl_certificate /etc/letsencrypt/live/api.devehoper.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.devehoper.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;

    # Root and index
    root /var/www/devehoper/public;
    index index.php index.html index.htm;

    # Logging
    access_log /var/log/nginx/devehoper.access.log;
    error_log /var/log/nginx/devehoper.error.log;

    location / {
        # --- START: CORS HANDLING ---

        # For preflight OPTIONS requests, return 204 and the necessary headers.
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' "$cors_origin" always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' 86400; # Cache preflight for 24 hours
            add_header 'Content-Length' 0;
            return 204;
        }

        # For actual requests (GET, POST, etc.), add the CORS headers.
        add_header 'Access-Control-Allow-Origin' "$cors_origin" always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        # --- END: CORS HANDLING ---

        # Pass the request to CodeIgniter's front controller.
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP handler
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

     # Block hidden files
    location ~ /\. {
        deny all;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public";
    }
}