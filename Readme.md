mongo --host 139.84.156.217 --port 32000 --username <username> --password '<password>' --authenticationDatabase admin
use NIRBHAVA; // Replace with your actual database name
db.createCollection('exampleCollection');
show databases;


to pull image from container registry
docker login and then run
docker pull ewr.vultrcr.com/nirbhavacontainerregistry/nirbhava-api:latest
docker run -p 5001:5001 ewr.vultrcr.com/nirbhavacontainerregistry/nirbhava-api