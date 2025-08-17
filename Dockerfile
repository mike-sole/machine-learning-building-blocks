FROM jekyll/jekyll:4.2.2

# Copy Gemfile and Gemfile.lock first for caching
COPY Gemfile Gemfile.lock ./

RUN gem install bundler -v 2.5.7

# Install dependencies
RUN bundle config set --local deployment 'true' && bundle install
