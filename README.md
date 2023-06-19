# WebRTC Player Portal

This is a web portal for playing WebRTC streams from a webrtc player machine.
The portal is written in node.js and uses nginx as a reverse proxy.

### Acces to the portal:
The portal is protected by a login page.
The login page is a nginx proxy to a node.js app that handles the authentication.
The authentication is done by e.g Azure AD.

Accessing the portal from local machine can be done by:
```
http://localhost:3910
```

There's an admin page where you can get links for the webrtc player machines.
```
http://localhost:3910/admin
```

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

The file is a json array with objects. Each object is a webrtc player machine.
The ninjaplayer will create a unique id for it's machine, and post it to the portal. via /updatelink
The id is used to identify the machine in the portal.

It's also possible to add static pages to the portal. (see example below)

```
[
    {
        "id":"unique_id_created_by_ninja_player",
        "label":"Olzzon Basement",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":"","lores":""}
    },
    {
        "id":"unique_id_created_by_ninja_player",
        "label":"Olzzon Basement2",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":"", "lores":""}
    },
        {
        "id":"random_hash",
        "label":"Some_www_page",
        "staticUrl":"https://www.google.com",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":"", "lores":""}
    },
etc......
```


### Co-turn server:
If you wish to setup your own Co-turn there a discription here:
./doc/installers/coturn/coturn-install.md

