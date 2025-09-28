FROM certbot/certbot:latest

RUN apk add --no-cache dcron docker-cli

COPY scripts/renew.sh /usr/local/bin/renew.sh
RUN chmod +x /usr/local/bin/renew.sh

RUN echo "0 */12 * * * /usr/local/bin/renew.sh" | crontab -

CMD ["crond", "-f"]