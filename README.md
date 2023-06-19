# WebRTC Player Portal

This is a web portal for playing WebRTC streams, using the REST API in [WebRTC Player]

### Run it using Docker:

Run the docker.compose file: 

./doc/installers/app/docker-compose.yml

In the host machine home folder the app will create a file where the settings are stored. 
You can add your webrtc player machines in this file.

```
nano webrtcportal-settings.json
```

### Authentication:
Run the docker-compose file: ./doc/installers/auth/docker-compose.yml

Setup nginx to proxy the auth service. 
See the nginx.conf file: ./doc/installers/auth/nginx.conf 

Edit it and place it in this folder: /etc/nginx/sites-enabled on the nginx server

### webrtcportal-settings.json format:

```
[
    {
        "id":"unique_id_created_by_ninja_player",
        "label":"Olzzon Basement",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":"","lores":""}
    },
        "id":"unique_id_created_by_ninja_player",
        "label":"Olzzon Basement2",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":"", "lores":""}
    },
etc......
```


### Co-turn server:
If you wish to setup your own Co-turn there a discription here:
./doc/installers/coturn/coturn-install.md

