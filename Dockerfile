FROM java:8

# Dockerfile author / maintainer
MAINTAINER Sachin Goyal <sachin.goyal.se@gmail.com>

VOLUME /opt/web

ADD build/libs/web.jar /opt/web/web.jar

ENTRYPOINT ["java","-jar","/opt/web/web.jar"]
