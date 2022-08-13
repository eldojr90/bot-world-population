const { get } = require('axios');
const cheerio = require('cheerio');
const {estimate, getWorldPop} = require('./world.pop');

const uri =
  'https://populationmatters.org/population-numbers?gclid=CjwKCAjwnZaVBhA6EiwAVVyv9GUkq1yurVjXe042wt7NVzhwvG3c2Ir7HpwE-rNx0IOK9VMIaOVG6BoCaxwQAvD_BwE';

const getConfig = async () => {
  const {data} = await get(uri);
  return cheerio.load(data);
};

const getCurrentWorldPopulation = async () => {
  const $ = await getConfig();
  const body = $('body').html();
  const worldPop = getWorldPop();
  const diffTo8Bi = new Intl.NumberFormat('pt-BR').format(
    8000000000 - estimate()
  );
  const timeInDays = (8000000000 - estimate()) / 2.6 / 86400;
  const timeInMonths = Math.floor(timeInDays / 30);
  const diffDays1 = Math.floor((timeInDays / 30 - timeInMonths) * 30);
  const diffWeeks = Math.floor(diffDays1 / 7);
  const diffDays = Math.floor((diffDays1 / 7 - diffWeeks) * 7);
  const diffHours1 = (((diffDays1 / 7 - diffWeeks) * 7) - diffDays) * 24;
  const diffHours2 = (timeInDays - Math.floor(timeInDays)) * 24;
  const diffHours = Math.floor(diffHours1 + diffHours2);
  const diffMinutes = Math.floor((diffHours1 + diffHours2 - diffHours) * 60);
  const diffSeconds = Math.floor(
    ((diffHours1 + diffHours2 - diffHours) * 60 - diffMinutes) * 60
  );

  console.log(
    `Current World Population ${worldPop} (+${diffTo8Bi} to 8BI) (${timeInMonths} months, ${diffWeeks} weeks, ${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes, ${diffSeconds} seconds)`
  );
};

(async () => {
  setInterval(await getCurrentWorldPopulation, 5000);
})();
