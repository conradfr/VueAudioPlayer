FROM php:7.4.14-fpm

# Copy composer.lock and composer.json
# COPY ./composer.lock ./composer.json /var/www/
RUN mkdir -p /scripts
COPY ./docker/docker-entry.sh /scripts

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY ./ /var/www/
RUN ls /var/www

RUN mkdir -p /var/www/var/
# RUN chmod -R 777 /var/www/var
RUN chown -R www-data:www-data /var/www/
# RUN chown -R www:www /var/www/html

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libpq-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    nginx \
	zlib1g-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
# RUN docker-php-ext-install xml curl
# RUN docker-php-ext-configure gd --with-gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/
# RUN docker-php-ext-install gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --no-interaction -o
# Add user for laravel application
#RUN groupadd -g 1000 www
#RUN useradd -u 1000 -ms /bin/bash -g www www


COPY ./docker/app.conf /etc/nginx/conf.d/app.conf
RUN ls /etc/nginx/conf.d

COPY ./docker/local.ini /usr/local/etc/php/conf.d/local.ini
RUN ls /usr/local/etc/php/conf.d
RUN cat /usr/local/etc/php/conf.d/local.ini

RUN rm -rf /etc/nginx/sites-enabled
RUN mkdir -p /etc/nginx/sites-enabled

RUN chmod -R 777 /var/www/web
#RUN php bin/console cache:clear (don t do it with a symfony app because composer.json script post install and update do it)

# Expose port 80 and start php-fpm server
EXPOSE 80

WORKDIR /scripts
RUN chmod +x ./docker-entry.sh
RUN ls .
CMD ["./docker-entry.sh"]
