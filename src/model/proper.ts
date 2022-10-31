export default class proper {
  caldate: string;
  proper: number;
  season: string;
  weekday: number;
  year: string;
  propername: string;

  feasts: Map;

  // incoming format yyyy-mm-dd
  constructor(simple: string) {
    console.debug("new proper()", simple);
    const s = simple.split("-");
    const d = new Date(+s[0], +s[1], +s[2]);

    this.caldate = +s[1] + "-" + +s[2]; // stored in Firestore as m-d / mm-dd
    this.weekday = d.getDay();

    const years = ["A", "B", "C"];
    this.year = years[(+s[0] + 2) % 3];

    this.setFeasts(+s[0]);
    // this.season = "advent"; // tbd
    // this.proper = 1; // tbd
    this.getSeason(d);
  }

  toString() {
    return (
      "(" +
      this.caldate +
      ") (" +
      this.season +
      "-" +
      this.proper +
      ") - " +
      this.weekday +
      " " +
      this.year
    );
  }

  addDays(d, days) {
    const n = new Date(d);
    n.setDate(n.getDate() + days);
    return n;
  }

  setFeasts(year) {
    const easter = this.getEaster(year);

    // fix Christ the King to Sunday
    let christking = new Date(year, 10, 20, 0, 0, 0);
    if (christking.getDay() != 0) {
      christking = this.addDays(christking, 7 - christking.getDay());
    }

    this.feasts = new Map([
      ["epiphany", new Date(year, 0, 6, 0, 0, 0)],
      ["easter", easter],

      /* almost everthing is relative to easter */
      ["mardigras", this.addDays(easter, -47)],
      ["ashwednesday", this.addDays(easter, -46)],
      ["palmsunday", this.addDays(easter, -7)],
      ["maundythursday", this.addDays(easter, -3)],
      ["goodfriday", this.addDays(easter, -2)],
      ["holysaturday", this.addDays(easter, -1)],
      ["ascensioneve", this.addDays(easter, 38)],
      ["ascension", this.addDays(easter, 39)],
      ["pentecost", this.addDays(easter, 49)],
      ["trinity", this.addDays(easter, 56)],
      ["stluke", new Date(year, 9, 18, 0, 0, 0)],

      // when "proper 1" starts, really should be first Sunday after May 1?
      ["proper1", new Date(year, 4, 8, 0, 0, 0)],

      /* fake feast for switching seasons */
      ["sept1", new Date(year, 8, 1, 0, 0, 0)],

      /* Christ the King is Sunday on or after Nov 20 */
      ["christking", christking],

      /* advent starts the following week */
      ["advent", this.addDays(christking, 7)],

      /* Chrismas has a fixed date */
      ["christmaseve", new Date(year, 11, 24, 0, 0, 0)],
      ["christmas", new Date(year, 11, 25, 0, 0, 0)],
    ]);
  }

  // https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
  getEaster(year: number) {
    const f = Math.floor;
    // Golden Number - 1
    const G: number = year % 19;
    const C: number = f(year / 100);
    // related to Epact
    const H: number = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
    // number of days from 21 March to the Paschal full moon
    const I: number = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
    // weekday for the Paschal full moon
    const J: number = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
    // number of days from 21 March to the Sunday on or before the Paschal full moon
    const L: number = I - J;
    const month: number = 3 + f((L + 40) / 44);
    const day: number = L + 28 - 31 * f(month / 4);

    return new Date(year, month - 1, day, 0, 0, 0);
  }

  // https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
  getDayOfYear(d: date) {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff =
      d -
      start +
      (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  getSeason(today: Date) {
    let isnextlectyear = 0; // needed for lectionary year below
    const nextday = 86400000;
    const f = (n) => {
      return this.feasts.get(n).getTime();
    };
    const fdoy = (n) => {
      return this.getDayOfYear(this.feasts.get(n));
    };
    const t = today.getTime();

    console.log(t, f("epiphany"));

    // determine the season, proper
    if (t < f("epiphany")) {
      this.season = "christmas";
      let doc: number = this.getDayOfYear(today) - fdoy("christmas") + 1;
      // this.propername = cardToOrd(doc) . ' day of Christmas';
      this.proper = doc;
    } else if (t >= f("epiphany") && t < f("epiphany") + nextday) {
      this.season = "epiphany";
      this.propername = "Epiphany";
      this.proper = 0;
    } else if (t > f("epiphany") && t < f("mardigras")) {
      this.season = "afterepiphany";
      const daysintoordtime = this.getDayOfYear(today) - fdoy("epiphany") + 1;
      const weeksintoordtime = Math.floor(daysintoordtime / 7) + 1;
      // this.propername = cardToOrd($weeksintoordtime) . " " . $brev['date_g']['weekday'] . " after Epiphany";
      this.proper = weeksintoordtime;
    } else if (t >= f("mardigras") && t < f("ashwednesday")) {
      this.season = "mardigras";
      this.propername = "Shrove Tuesday";
      this.proper = 0;
    } else if (t >= f("ashwednesday") && t < f("ashwednesday") + nextday) {
      this.season = "ashwednesday";
      this.propername = "Ash Wednesday";
      this.proper = 0;
    } else if (t > f("ashwednesday") && t < f("palmsunday")) {
      this.season = "lent";
      const daysintolent = this.getDayOfYear(today) - fdoy("ashwednesday") + 1;
      const weeksintolent = Math.floor(daysintolent / 7) + 1;
      // this.propername       = cardToOrd($weeksintolent) . " " . this.['date_g']['weekday'] . " of Lent";
      this.proper = weeksintolent;
    } else if (t >= f("palmsunday") && t < f("palmsunday") + nextday) {
      this.season = "palmsunday";
      this.propername = "Palm Sunday";
      this.proper = 0;
    } else if (t > f("palmsunday") && t < f("maundythursday")) {
      this.season = "holyweek";
      // this.propername       = this.['date_g']['weekday'] . " of Holy Week";
      this.proper = 0;
    } else if (t >= f("maundythursday") && t < f("goodfriday")) {
      this.season = "maundythursday";
      this.propername = "Manundy Thursday";
      this.proper = 0;
    } else if (t >= f("goodfriday") && t < f("holysaturday")) {
      this.season = "goodfriday";
      this.propername = "Good Friday";
      this.proper = 0;
    } else if (t >= f("holysaturday") && t < f("easter")) {
      this.season = "holysaturday";
      this.propername = "Holy Saturday";
      this.proper = 0;
    } else if (t >= f("easter") && t < f("easter") + nextday) {
      this.season = "easter";
      this.propername = "Easter Sunday";
      this.proper = 0;
    } else if (t > f("easter") && t < f("ascension")) {
      this.season = "greatfifty";
      const daysaftereaster = this.getDayOfYear(today) - (fdoy("easter") + 1);
      const weeksaftereaster = Math.floor(daysaftereaster / 7) + 1;
      // this.propername = cardToOrd($weeksaftereaster) . " " . this.['date_g']['weekday'] . " of Eastertide";
      this.proper = weeksaftereaster;
    } else if (t >= f("ascensioneve") && t < f("ascension")) {
      this.season = "ascensioneve";
      this.propername = "Eve of the Ascension";
      this.proper = 0;
    } else if (t >= f("ascension") && t < f("ascension") + nextday) {
      this.season = "ascension";
      this.propername = "The Feast of the Ascension";
      this.proper = 0;
    } else if (t > f("ascension") && t < f("pentecost")) {
      this.season = "greatfifty";
      // this.propername       = this.['date_g']['weekday'] . " after Ascension"; // this isn't right since it is 10 days...
      const daysaftereaster = this.getDayOfYear(today) - (fdoy("easter") + 1);
      const weeksaftereaster = Math.floor(daysaftereaster / 7) + 1;
      this.proper = weeksaftereaster;
    } else if (t >= f("pentecost") && t < f("pentecost") + nextday) {
      this.season = "pentecost";
      this.propername = "Pentecost";
      const daysaftereaster = this.getDayOfYear(today) - fdoy("easter");
      const weeksaftereaster = Math.floor(daysaftereaster / 7) + 1;
      this.proper = weeksaftereaster;
    } else if (t > f("pentecost") && t < f("trinity")) {
      this.season = "afterpentecost";
      const daysafterp = getDayOfYeaer(today) - (fdoy("proper1") + 1);
      const weeksafterp = Math.floor(daysafterp / 7) + 1;
      this.propername = "Proper " + weeksafterp + "; After Pentecost";
      this.proper = weeksafterp;
    } else if (t >= f("trinity") && t < f("trinity") + nextday) {
      this.season = "trinity";
      this.propername = "Trinity Sunday";
      this.proper = 0;
    } else if (t > f("trinity") && t < f("sept1")) {
      this.season = "afterpentecost";
      const daysafterp = this.getDayOfYear(today) - (fdoy("proper1") + 1);
      const weeksafterp = Math.floor(daysafterp / 7) + 1;
      this.propername = "Proper " + weeksafterp + "; After Pentecost";
      this.proper = weeksafterp;
    } else if (t >= f("sept1") && t < f("christking")) {
      this.season = "beforeadvent";
      const daysafterp = this.getDayOfYear(today) - (fdoy("proper1") + 1);
      const weeksafterp = Math.floor(daysafterp / 7) + 1;
      this.propername = "Proper " + weeksafterp + "; Before Advent";
      this.proper = weeksafterp;
    } else if (t >= f("christking") && t < f("christking") + nextday) {
      this.season = "christking";
      this.propername = "Christ the King Sunday";
      this.proper = 0;
    } else if (t > f("christking") && t < f("advent")) {
      this.season = "beforeadvent";
      const daysafterp = this.getDayOfYear(today) - (fdoy("pentecost") + 1);
      const weeksafterp = Math.floor(daysafterp / 7) + 1;
      // this.propername       = cardToOrd($weeksafterp) . " " . this.['date_g']['weekday'] . " after Pentecost"; // XXX before advent
      this.propername = "Proper ".$weeksafterp;
      this.proper = weeksafterp;
    } else if (t >= f("advent") && t < f("christmaseve")) {
      this.season = "advent";
      isnextlectyear = true;
      const daysaftera = this.getDayOfYear(today) - (fdoy("advent") + 1);
      const weeksaftera = Math.floor(daysaftera / 7) + 1;
      // this.propername       = cardToOrd(weeksaftera) . " " . this.['date_g']['weekday'] . " of Advent";
      this.proper = weeksaftera;
    } else if (t >= f("christmaseve") && t < f("christmas")) {
      this.season = "christmaseve";
      isnextlectyear = true;
      this.propername = "Christmas Eve";
      this.proper = 0;
    } else if (t >= f("christmas") && t < f("christmas") + nextday) {
      this.season = "christmasday";
      isnextlectyear = true;
      this.propername = "Christmas";
      this.proper = 0;
    } else if (t > f("christmas")) {
      this.season = "christmas";
      isnextlectyear = true;
      // $doc                  = (t - f('christmas']) / nextday + 1;
      // this.propername       = cardToOrd($doc) . ' day of Christmas';
      // this.proper = $doc;
      this.proper = 0;
    } else {
      this.proper = 0;
      this.season = "unknown";
      // die("impossible day? <br/>today: {t}</br>" . print_r($feast, TRUE) );
    }
  }
}

/* 
    $_ly                    = array(
        0 => 'C',
        1 => 'A',
        2 => 'B'
    );
    this.['lectionaryyear'] = $_ly[(this.['date_g']['year'] + $isnextlectyear) % 3];
    
    this.['title'] = this.season . "-" . this.proper . "-" . this.['date_g']['weekday'] . "-" . this.['lectionaryyear'] . "-" . this.['template'] . "-" . date("h:i", time());

    }
    }
    */
