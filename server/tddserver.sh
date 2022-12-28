#!/bin/bash

while :
do
    echo "awaiting user command..."
    usrCmd=$(minimodem -r 100 -c 3 -q --rx-one --print-filter)
    echo "received command: $usrCmd"

    if [ "$usrCmd" == "exit" ] || [ "$usrCmd" == "EXIT" ];
    then
        echo "goodbye. please hangup" | minimodem -t 100
        exit 0
    fi

    tddOutput="$(./msgProcess.js $usrCmd)" 
    echo "$tddOutput" | minimodem -t 100

done
