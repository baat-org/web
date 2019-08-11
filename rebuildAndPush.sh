docker rmi $(docker images -qa 'sachingoyaldocker/baat-org-web')

./gradlew clean build bootJar
docker build --no-cache -t sachingoyaldocker/baat-org-web:1.0 . 
docker push sachingoyaldocker/baat-org-web:1.0
