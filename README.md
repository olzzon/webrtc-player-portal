# WebRTC Player Portal

This is a web portal for playing WebRTC streams, using the REST API in [WebRTC Player]

### Run it using Docker:

Run the docker.compose file: ./doc/installers/docker-compose.yml

In the host machine home folder the app will create a file where the settings are stored. You can add your webrtc player machines in this file.

```
nano webrtcportal-settings.json
```

### webrtcportal-settings.json format:

```
[
    {
        "url":"http://ip_adress_of_webrtcplayer:3900/linkurl",
        "label":"Olzzon Basement",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":""}
    },
        "url":"http://ip_adress_of_another_webrtcplayer:3900/linkurl",
        "label":"Olzzon Basement2",
        "userGroup": "default",
        "link":{"viewer":"","guest":"","broadcast":"","director":""}
    },
etc......
```
