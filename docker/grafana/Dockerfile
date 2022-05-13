FROM grafana/grafana:5.4.3


WORKDIR /grafana

# 數據源 Datasources /provisioning/datasources/
# 儀錶板 Dashboards /provisioning/dashboards/
# 警報通知頻道 Alert Notification Channels /provisioning/notifiers/
COPY ./docker/grafana/grafana.ini /etc/grafana/grafana.ini
COPY ./docker/grafana/provisioning /etc/grafana/provisioning
COPY ./docker/grafana/dashboards /var/lib/grafana/dashboards