#!/bin/sh

echo "Listening for incoming calls..."
tail -fn0 bbs.log | \
while read line ; do
        echo "$line" | grep -q "CONFIRMED"
        if [ $? = 0 ]
        then
            echo "***********************"
            echo "**** Call received ****"
            echo "Starting tdd server..."
            ./tddserver.sh &
        fi
        echo "$line" | grep -q "DISCONNCTD"
        if [ $? = 0 ]
        then
            echo "**** Call ended ****"
            echo "Killing tdd server..."
            killall tddserver.sh
            killall minimodem
        fi
done

