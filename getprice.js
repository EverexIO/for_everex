#!/usr/bin/env node
const argv = require('optimist').argv;
const getPrice = require('./src/get_price');

var sum1=0, sum2=0;

function offerToString(offer) {
  let dec = Math.pow(10, 18);
  const pair = offer.pair.split('/');
  sum1 += parseInt(offer.payAmt/dec);
  sum2 += parseInt(offer.buyAmt/dec);
  return `${parseInt(offer.payAmt/offer.buyAmt)} ${sum1} ${sum2} ${pair[0]} ${offer.payAmt/dec} for ${pair[1]} ${offer.buyAmt/dec}`;
}

async function f() {
  if (!argv.pair || !argv.amount || argv.h) {
    console.log(`
Usage: getprice.js [OPTIONS]

A self-sufficient runtime for containers

Options:
  -h          Show this message
  --amount    Amount of needed token 
  --pair      Token pair (expample W-ETH/DAI)
`);
  }
  else {
    const price = await getPrice(argv.pair, argv.amount);
    if (price === false) {
      console.log(`Pair ${argv.pair} not in whitelist`);
      process.exit(0);
    }
    if (price.price > 0) {
      console.log(`Price for pair ${argv.pair} is ${price.price}`);
    } else {
      console.log(`You can't buy ${argv.amount} token. Amount too mutch`);
    }
    console.log(`Top better order:`);
    price.offers.map(o => {
      console.log(offerToString(o));
    })
    console.log(`Last takes:`);
    price.takes.map(o => {
      console.log(offerToString(o));
    })

  }
}

f();
