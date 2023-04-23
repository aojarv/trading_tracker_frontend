<script lang="ts">
  export let data: IData | null;

  import { scaleLinear, scaleTime } from 'd3-scale';
  const gWidth = 800;
  const gHeight = 400;

  const locales: Record<string, string> = {
    alltimeperformance: 'All time profit',
    ytdperformance: 'Profit YTD',
  };

  const parseInitialReference = (series: Record<string, ITimeseries[]>): string => {
    const keys = Object.keys(series).filter(k => k !== 'account');
    return keys[0];
  }

  let reference = parseInitialReference(data.timeseries);
  const references = Object.keys(data.timeseries).filter(k => k !== 'account');
  const changeReference = (r: string): void => {
    reference = r;
  }

  /** Function for calculating value range of the timeseries*/
  const parseValueRange = (series: Record<string, ITimeseries[]>): [number, number] => {
    const values: number[] = [];
    Object.values(series).forEach(serie => {
      values.push(...serie.map(item => item.value));
    })
    const abs = Math.max(Math.abs(100 - Math.min(...values)), Math.abs(100 - Math.max(...values)));
    return [100 - abs - 1, 100 + abs + 1];
  }

  /** Function for calculating date range of the timeseries*/
  const parseDateRange = (series: Record<string, ITimeseries[]>): [Date, Date] => {
    const dates: string[] = [];
    Object.values(series).forEach(serie => {
      dates.push(...serie.map(item => item.date));
    })
    dates.sort();
    if (dates.length < 2) return [new Date(2023, 0 , 1), new Date()];
    return [parseDate(dates[0]), parseDate(dates[dates.length - 1])];
  }

  /** Function for parsing date (of fromat yyyy-mm-dd) into a js date*/
  const parseDate = (date: string): Date => {
    const d = date.split('-');
    return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
  }

  const formatDate = (date: Date): string => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  /** These are for defining ranges for x- and y-axis */
  $: dateRange = parseDateRange(data.timeseries);
  $: minMax = parseValueRange(data.timeseries);

  /** Ticks/labels for x- and y-axis */
  $: xTicks = scaleTime().domain(dateRange).ticks();
  $: yTicks = scaleLinear().domain(minMax).ticks();

  /** These are for calculating x- and y-values of single data points */
  $: xScale = scaleTime().domain(dateRange).range([0, gWidth]);
  $: yScale = scaleLinear().domain(minMax).range([gHeight, 0]);

  const parseReferencePaths = (series: Record<string, ITimeseries[]>): Record<string, string> => {
    const paths = {};
    Object.entries(series).forEach(([key, value]) => {
      if (key === 'account') return;
      paths[key] = `M${value.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`
    })
    return paths;
  }

  $: qqqPath = `M${data.timeseries.qqq.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`;
  $: spxPath = `M${data.timeseries.spx.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`;
  $: accountPath = `M${data.timeseries.account.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`;
  $: referencePaths = parseReferencePaths(data.timeseries)
</script>

<div class="w-full h-full flex flex-col items-center">
  <p class="text-center uppercase my-2 italic font-semibold text-4xl text-dark-shades">Statistics</p>
  <div class="w-4/5 my-10">
    <svg viewBox={`0 0 ${gWidth} ${gHeight}`} overflow="visible">
      <!-- yAxis -->
      <g>
        {#each yTicks as tick}
          <g transform={`translate(0,${yScale(tick)})`}>
            <text class="text-xs italic font-semibold" dominant-baseline="central" x="-3%">{tick}</text>
            <line x1="0%" x2="100%" y1="1" y2="1" class="stroke-0.5 stroke-dark-shades" stroke-dasharray="4 4" />
          </g>
        {/each}
      </g>
      <!-- xAxis -->
      <g>
        {#each xTicks as tick}
          <g transform={`translate(${xScale(tick)},0)`}>
            <text y="103%" text-anchor="middle" class="text-xs italic font-semibold">{formatDate(tick)}</text>
            <line y1="0%" y2="100%" x1="1" x2="1" class="stroke-0.5 stroke-dark-shades" stroke-dasharray="4 4" />
          </g>
        {/each}
      </g>
      <!-- Reference path -->
      <path fill="none" class="stroke-dark-shades stroke-1" stroke-linecap="round" stroke-linejoin="round" d={referencePaths[reference]} />
      <!-- Account -->
      <path class="stroke-1 hover:stroke-2 stroke-main-brand-color fill-none hover:cursor-pointer" stroke-linecap="round" stroke-linejoin="round" d={accountPath} />
      <!-- Label -->
      <svg height="100" width="100" class="rounded-lg" transform="translate(10,10)" overflow="hidden">
        <rect width="100%" height="100%" class="rounded-lg fill-light-accent" />
        <text text-anchor="middle" dominant-baseline="central" x="50%" y="50%" class="text-xs italic font-semibold select-none">
          <tspan x="50%" y="10" class="font-light text-light-accent">Treidaus-</tspan>
          <tspan x="50%" y="20" class="font-light text-light-accent">salkun</tspan>
          <tspan x="50%" y="30" class="font-light text-light-accent">kehitys</tspan>
          <tspan x="50%" y="50">{formatDate(dateRange[0])} = 100</tspan>
          <tspan class="cursor-pointer" x="50%" y="65" on:keypress={() => null} on:click={() => changeReference(references.filter(r => r !== reference)[0])}>Referenssi: <tspan class="uppercase">{reference}</tspan></tspan>
          <tspan x="50%" y="80" class="font-light text-light-accent">Paina referenssiä</tspan>
          <tspan x="50%" y="90" class="font-light text-light-accent">vaihtaaksesi sitä</tspan>
        </text>
      </svg>
    </svg>
  </div>
  <!-- TODO Tääki salee vaan svg:S -->
  <div class="w-4/5 my-10">
    {#each Object.entries(data.metadata) as row}
      <div class="w-1/2 h-10 my-2 border border-dark-shades rounded-lg px-4 pt-1">
        <span class="text-base italic">
          {row[0] in locales ? locales[row[0]] : row[0]}: 
        </span>
        <span class="italic font-semibold text-main-brand-color">{row[1].value}</span>
        <span class="italic">{row[1].type === 'percent' ? '%' : ''}</span>
      </div>
    {/each}
  </div>
</div>