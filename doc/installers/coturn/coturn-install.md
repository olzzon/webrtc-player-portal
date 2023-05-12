## Install and Config Coturn on Ubuntu 20.04:

# Install:
```
sudo apt-add-repository universe
sudo apt update && sudo apt upgrade
Reboot the server from the EC2 dashboard or with sudo reboot
sudo apt-get install coturn
```


### `/etc/default/coturn`
* un-comment TURNSERVER_ENABLED=1 to have CoTURN start on boot
### `/etc/turnserver.conf`
*  un-comment listening-port=3478
* un-comment listening-ip and replace with server private IP
* un-commenting `user=username1:password1` 

### `/lib/systemd/system/coturn.service`
* add AmbientCapabilities=CAP_NET_BIND_SERVICE in the [Service] section

## Reboot.
sudo reboot
sudo systemctl status coturn
