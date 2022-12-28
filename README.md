# acousticBBS
Simple minimodem BBS with 3D printed acoustic coupler case.

https://youtu.be/d5T_ZD9nXu0

The acoustic coupler was designed to hold USB speaker and microphone. I purchased them on Adafruit

https://www.adafruit.com/product/3367

https://www.adafruit.com/product/3369

Requires Linux. PJSUA and minimodem must be installed. The BBS uses shell scripts and javascript to relay messages via minimodem over VoIP.
On the server side, start PJSUA then start the phoneMonitor.sh script. Minimodem is set to run at 100bps. Edit the shell scripts if you want to change the baud

http://www.whence.com/minimodem/

https://www.pjsip.org/pjsua.htm
