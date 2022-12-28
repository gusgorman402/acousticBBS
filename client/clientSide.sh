#!/bin/sh
clear
echo "Make sure you are dialed into BBS and"
echo "phone is connected to acoustic coupler"
echo " "
echo "-------------------------------"
echo "     minimodem dialup BBS      "
echo "-------------------------------"
echo " "
echo "Enter 'help' for list of commands"
echo " "

while :
do
    read -p "Enter a command> " userInput
    echo $userInput | minimodem -t 100 -A1
    minimodem -r 100 -c 3 -q --print-filter --rx-one -A0
done
