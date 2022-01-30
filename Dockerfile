FROM ruby:3.0.3

# dependencies for gems
RUN apt-get update -qq
RUN apt-get install -y build-essential nodejs --no-install-recommends

# startup script
COPY docker/initcontainer.sh /bin/
RUN chmod 755 /bin/initcontainer.sh

# environment variables
ENV RAILS_ENV production
ENV PATH ${PATH}:/home/site/wwwroot
ENV RAILS_LOG_TO_STDOUT true
ENV RAILS_SERVE_STATIC_FILES true

WORKDIR /home/site/wwwroot

# include application code in the image - everything in the project that's not ignored in .dockerignore
ADD . /home/site/wwwroot

# install gems
RUN bundle config --local path "vendor/bundle"
RUN bundle install --no-deployment

ENTRYPOINT [ "/bin/initcontainer.sh" ]
