#!/usr/bin/node

const openweatherAPIkey = "PUT YOUR OPEN WEATHER API KEY HERE";
const etherscanAPIkey = "PUT YOUR ETHERSCAN API KEY HERE";

var dateTime = new Date();
const fs = require('fs');
const fetch = require('node-fetch');
const ethRegEx = /^0x[a-fA-F0-9]{40}$/;
const ethTxRegEx = /^0x[a-fA-F0-9]{40,}$/;

if (process.argv.length < 3) {
  console.error('Invalid command');
  process.exit(1);
}

var bbsCmd = process.argv[2];
bbsCmd = bbsCmd.toLowerCase();
process.argv.splice(0, 3);
var bbsData = process.argv.join(' ');
bbsData = bbsData.toLowerCase();

switch (bbsCmd){
    case 'weather':
        getWeather(bbsData);
        break;
    case 'acct':
        getAcctInfo(bbsData);
        break;
    case 'psttx':
        postTransaction(bbsData);
        break;
    case 'pstmsg':
        postBBSmessage(bbsData);
        break;
    case 'lstmsgs':
        listBBSmessages();
        break;
    case 'help':
        helpMenu();
        break;
    default:
        console.log('invalid command');
}

async function getWeather(coords) {
    let latlon = coords.split(",");
    let weatherQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latlon[0] + "&lon=" + latlon[1] + "&appid=" + openweatherAPIkey + "&units=imperial";
    let weatherProxy = await fetch(weatherQuery);
    let response = await weatherProxy.json();
    console.log("Time\tTemp\tHumidity\tWindSpeed\tWindDir\tDesc");
    let weatherTime;
    let counter = 0;
    for (const key in response.list){
        //console.log(key, " : ", response.list[key].main);
        weatherTime = response.list[key].dt_txt;
        weatherTime = weatherTime.slice(5,16);
        console.log(weatherTime, "\t", response.list[key].main.temp, "\t", response.list[key].main.humidity,
                    "\t", response.list[key].wind.speed, "\t", response.list[key].wind.deg, "\t", response.list[key].weather[0].description);
        if( counter++ > 40 ){ break; }
    }
}

async function getAcctInfo(ethAddress) {
    if( !(ethRegEx.test(ethAddress)) ){
        console.log("bad address");
        process.exit(1);
    }
    let etherQuery = "https://api.etherscan.io/api?module=account&action=balance&address=" + ethAddress + "&tag=latest&apikey=" + etherscanAPIkey;
    let etherscanProxy = await fetch(etherQuery);
    let response = await etherscanProxy.json();
    if( response.hasOwnProperty('error') || response.message != "OK" ) {
        console.log("bad address");
        process.exit(1);
    }

    let acctBalance = response.result;
    acctBalance = (acctBalance / 1000000000000000000).toFixed(5);
    //console.log(response.result, "wei");
    etherQuery = "https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=" + ethAddress + "&tag=latest&apikey=" + etherscanAPIkey;
    etherscanProxy = await fetch(etherQuery);
    response = await etherscanProxy.json();
    if( response.hasOwnProperty('error') ) {
        console.log("bad address");
        process.exit(1);
    }
    let nonce = parseInt(response.result, 16);
    console.log(acctBalance, "ETH  Nonce:", nonce);
}

async function postTransaction(signedTx) {
    if( !(ethTxRegEx.test(signedTx)) ) {
        console.error("bad tx msg");
        process.exit(1);
    }
    let etherQuery = "https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=" + signedTx + "&apikey=" + etherscanAPIkey;
    let etherscanProxy = await fetch(etherQuery);
    let response = await etherscanProxy.json();
    if( response.hasOwnProperty('error') ){
        console.log("bad tx msg");
        process.exit(1);
    }
    let txHash = response.result;
    console.log("Tx Hash:", txHash);
}

function postBBSmessage(userMsg) {
    if(userMsg.length > 80){
        console.error('msg too long');
        process.exit(1);
    }
    let dateTime = new Date();
    dateStr = dateTime.toISOString();
    dateStr = dateStr.slice(5,16);
    let message = dateStr + "\n" + userMsg + "\n\n";
    fs.appendFile('bbsMessages.txt', message, err => {
        if (err) {
            console.log("Error posting");
        }
        else {
            console.log("Msg posted");
        }
    });
}

function listBBSmessages() {
    fs.readFile('bbsMessages.txt', 'utf8', function(err, data) {
        if (err) { console.log('error reading'); }
        else { console.log(data); }
    });
}

function helpMenu() {
    console.log('Available command : command description');
    console.log('weather lat,lon : get forecast');
    console.log('acct ethereumAcct : get etheruem balance');
    console.log('psttx ethereumTX : send signed transaction');
    console.log('pstmsg yourMessage : post bbs message < 80 chars');
    console.log('lstmsgs : list bbs messages');
    console.log('help : list commands');
    console.log('exit : end session');
}
