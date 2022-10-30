import { getEaster } from "../easter";

export default class proper {
  caldate: string;
  proper: number;
  season: string;
  weekday: number;
  year: string;

  feasts: Map;

  // incoming format yyyy-mm-dd
  constructor(simple: string) {
    console.debug("new proper()", simple);
    const s = simple.split("-");
    const d = new Date(s[0], s[1], s[2]);

    this.caldate = +s[1] + "-" + +s[2]; // stored in Firestore as m-d / mm-dd
    this.weekday = d.getDay();

    const years = ["A", "B", "C"];
    this.year = years[(+s[0] + 2) % 3];

    this.setFeasts(+s[0]);

    this.proper = 1; // tbd
    this.season = "advent"; // tbd
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
    const e = getEaster(year);
    const easter = new Date(year, e[0] - 1, e[1], 0, 0, 0);

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
}

/* 
    
  $isnextlectyear = 0; // needed for lectionary year below

    $brev['season'] = 'UNKNOWN';
    $brev['proper'] = 'UNKNOWN';
    $brev['propernumber'] = 'UNKNOWN';

    // determine the season, proper 
    if ($today < $feast['epiphany']) {
        $brev['season']       = 'christmas';
        $christmas            = strtotime("12/25/" . ($brev['date_g']['year'] - 1));
        $doc                  = ($today - $christmas) / 86400 + 1;
        $brev['proper']       = cardToOrd($doc) . ' day of Christmas';
        $brev['propernumber'] = $doc;
    } else if ($today >= $feast['epiphany'] && $today < $feast['epiphany'] + 86400) {
        $brev['season']       = 'epiphany';
        $brev['proper']       = 'Epiphany';
        $brev['propernumber'] = '';
    } else if ($today > $feast['epiphany'] && $today < $feast['mardigras']) {
        $brev['season']       = 'afterepiphany';
        $epi_g                = getdate($feast['epiphany']);
        $daysintoordtime      = $brev['date_g']['yday'] - ($epi_g['yday'] + 1);
        $weeksintoordtime     = (int) ($daysintoordtime / 7) + 1;
        $brev['proper']       = cardToOrd($weeksintoordtime) . " " . $brev['date_g']['weekday'] . " after Epiphany";
        $brev['propernumber'] = $weeksintoordtime;
    } else if ($today >= $feast['mardigras'] && $today < $feast['ashwednesday']) {
        $brev['season']       = 'mardigras';
        $brev['proper']       = 'Shrove Tuesday';
        $brev['propernumber'] = 0;
    } else if ($today >= $feast['ashwednesday'] && $today < $feast['ashwednesday'] + 86400) {
        $brev['season']       = 'ashwednesday';
        $brev['proper']       = 'Ash Wednesday';
        $brev['propernumber'] = 0;
    } else if ($today > $feast['ashwednesday'] && $today < $feast['palmsunday']) {
        $brev['season']       = 'lent';
        $aw_g                 = getdate($feast['ashwednesday']);
        $daysintolent         = $brev['date_g']['yday'] - ($aw_g['yday'] + 1);
        $weeksintolent        = (int) ($daysintolent / 7) + 1;
        $brev['proper']       = cardToOrd($weeksintolent) . " " . $brev['date_g']['weekday'] . " of Lent";
        $brev['propernumber'] = $weeksintolent;
    } else if ($today >= $feast['palmsunday'] && $today < $feast['palmsunday'] + 86400) {
        $brev['season']       = 'palmsunday';
        $brev['proper']       = 'Palm Sunday';
        $brev['propernumber'] = 0;
    } else if ($today > $feast['palmsunday'] && $today < $feast['maundythursday']) {
        $brev['season']       = 'holyweek';
        $brev['proper']       = $brev['date_g']['weekday'] . " of Holy Week";
        $brev['propernumber'] = 0;
    } else if ($today >= $feast['maundythursday'] && $today < $feast['goodfriday']) {
        $brev['season']       = 'maundythursday';
        $brev['proper']       = 'Manundy Thursday';
        $brev['propernumber'] = 0;
    } else if ($today >= $feast['goodfriday'] && $today < $feast['holysaturday']) {
        $brev['season']       = 'goodfriday';
        $brev['proper']       = 'Good Friday';
        $brev['propernumber'] = 0;
    } else if ($today >= $feast['holysaturday'] && $today < $feast['easter']) {
        $brev['season']       = 'holysaturday';
        $brev['proper']       = 'Holy Saturday';
        $brev['propernumber'] = 0;
    } else if ($today >= $feast['easter'] && $today < $feast['easter'] + 86400) {
        $brev['season']       = 'easter';
        $brev['proper']       = 'Easter Sunday';
        $brev['propernumber'] = 0;
    } else if ($today > $feast['easter'] && $today < $feast['ascension']) {
        $brev['season']       = 'greatfifty';
        $e_g                  = getdate($feast['easter']);
        $daysaftereaster      = $brev['date_g']['yday'] - ($e_g['yday'] + 1);
        $weeksaftereaster     = (int) ($daysaftereaster / 7) + 1;
        $brev['proper']       = cardToOrd($weeksaftereaster) . " " . $brev['date_g']['weekday'] . " of Eastertide";
        $brev['propernumber'] = $weeksaftereaster;
    } else if ($today >= $feast['ascensioneve'] && $today < $feast['ascension']) {
        $brev['season']       = 'ascensioneve';
        $brev['proper']       = 'Eve of the Ascension';
        $brev['propernumber'] = 0;
    } else if ($today >= $feast['ascension'] && $today < $feast['ascension'] + 86400 ) {
        $brev['season']       = 'ascension';
        $brev['proper']       = 'The Feast of the Ascension';
        $brev['propernumber'] = 0;
    } else if ($today > $feast['ascension'] && $today < $feast['pentecost']) {
        $brev['season']       = 'greatfifty';
        $brev['proper']       = $brev['date_g']['weekday'] . " after Ascension"; // this isn't right since it is 10 days...
        $e_g                  = getdate($feast['easter']);
        $daysaftereaster      = $brev['date_g']['yday'] - ($e_g['yday'] + 1);
        $weeksaftereaster     = (int) ($daysaftereaster / 7) + 1;
        $brev['propernumber'] = $weeksaftereaster;
    } else if ($today >= $feast['pentecost'] && $today < $feast['pentecost'] + 86400 ) {
        $brev['season']       = 'pentecost';
        $brev['proper']       = 'Pentecost';
        $e_g                  = getdate($feast['easter']);
        $daysaftereaster      = $brev['date_g']['yday'] - ($e_g['yday'] + 1);
        $weeksaftereaster     = (int) ($daysaftereaster / 7) + 1;
        $brev['propernumber'] = $weeksaftereaster;
    } else if ($today > $feast['pentecost'] && $today < $feast['trinity']) {
        $brev['season']       = 'afterpentecost';
        $p_g                  = getdate($feast['proper1']);
        $daysafterp           = $brev['date_g']['yday'] - ($p_g['yday'] + 1);
        $weeksafterp          = (int) ($daysafterp / 7) + 1;
        $brev['proper'] = "Proper " . $weeksafterp . "; After Pentecost";
        $brev['propernumber'] = $weeksafterp;
    } else if ($today >= $feast['trinity'] && $today < $feast['trinity'] + 86400) {
        $brev['season']       = 'trinity';
        $brev['proper']       = 'Trinity Sunday';
        $brev['propernumber'] = 0;
    } else if ($today > $feast['trinity'] && $today < $feast['sept1']) {
        $brev['season']       = 'afterpentecost';
        $p_g                  = getdate($feast['proper1']);
        $daysafterp           = $brev['date_g']['yday'] - ($p_g['yday'] + 1);
        $weeksafterp          = (int) ($daysafterp / 7) + 1;
        $brev['proper'] = "Proper " . $weeksafterp . "; After Pentecost";
        $brev['propernumber'] = $weeksafterp;
    } else if ($today >= $feast['sept1'] && $today < $feast['christking']) {
        $brev['season']       = 'beforeadvent';
        $p_g                  = getdate($feast['proper1']);
        $daysafterp           = $brev['date_g']['yday'] - ($p_g['yday'] + 1);
        $weeksafterp          = (int) ($daysafterp / 7) + 1;
        $brev['proper'] = "Proper " . $weeksafterp . "; Before Advent";
        $brev['propernumber'] = $weeksafterp;
    } else if ($today >= $feast['christking'] && $today < $feast['christking'] + 86400) {
        $brev['season']       = 'christking';
        $brev['proper']       = 'Christ the King Sunday';
        $brev['propernumber'] = 0;
    } else if ($today > $feast['christking'] && $today < $feast['advent']) {
        $brev['season']       = 'beforeadvent';
        // $p_g                  = getdate($feast['pentecost']);
        $p_g                  = getdate($feast['proper1']);
        $daysafterp           = $brev['date_g']['yday'] - ($p_g['yday'] + 1);
        $weeksafterp          = (int) ($daysafterp / 7) + 1;
        // $brev['proper']       = cardToOrd($weeksafterp) . " " . $brev['date_g']['weekday'] . " after Pentecost"; // XXX before advent
        $brev['proper']       = "Proper " . $weeksafterp;
        $brev['propernumber'] = $weeksafterp;
    } else if ($today >= $feast['advent'] && $today < $feast['christmaseve']) {
        $brev['season']       = 'advent';
        $isnextlectyear       = 1;
        $a_g                  = getdate($feast['advent']);
        $daysaftera           = $brev['date_g']['yday'] - ($a_g['yday'] + 1);
        $weeksaftera          = (int) ($daysaftera / 7) + 1;
        $brev['proper']       = cardToOrd($weeksaftera) . " " . $brev['date_g']['weekday'] . " of Advent";
        $brev['propernumber'] = $weeksaftera;
    } else if ($today >= $feast['christmaseve'] && $today < $feast['christmas']) {
        $brev['season']       = 'christmaseve';
        $isnextlectyear       = 1;
        $brev['proper']       = 'Christmas Eve';
        $brev['propernumber'] = '';
    } else if ($today >= $feast['christmas'] && $today < $feast['christmas'] + 86400) {
        $brev['season']       = 'christmasday';
        $isnextlectyear       = 1;
        $brev['proper']       = 'Christmas';
        $brev['propernumber'] = '';
    } else if ($today > $feast['christmas']) {
        $brev['season']       = 'christmas';
        $isnextlectyear       = 1;
        $doc                  = ($today - $feast['christmas']) / 86400 + 1;
        $brev['proper']       = cardToOrd($doc) . ' day of Christmas';
        $brev['propernumber'] = $doc;
    } else {
	die("impossible day? <br/>today: {$today}</br>" . print_r($feast, TRUE) );
}

    
    $_ly                    = array(
        0 => 'C',
        1 => 'A',
        2 => 'B'
    );
    $brev['lectionaryyear'] = $_ly[($brev['date_g']['year'] + $isnextlectyear) % 3];
    
    $brev['title'] = $brev['season'] . "-" . $brev['propernumber'] . "-" . $brev['date_g']['weekday'] . "-" . $brev['lectionaryyear'] . "-" . $brev['template'] . "-" . date("h:i", time());

    }
*/
