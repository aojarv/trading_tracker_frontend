<script lang="ts">
  export let data: IData | null;

  import { scaleLinear, scaleTime } from 'd3-scale';
  import { onMount } from 'svelte';
  const gWidth = 800;
  const gHeight = 400;

  let dateRange = [new Date(2023, 0, 1), new Date(2023, 11, 31)];
  let minMax = [0, 150];

  const parseDate = (date: string): Date => {
    const d = date.split('-');
    return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
  }

  $: xTicks = scaleTime().domain(dateRange).ticks();
  $: yTicks = scaleLinear().domain(minMax).ticks();

  $: xScale = scaleTime().domain(dateRange).range([0, gWidth]);
  $: yScale = scaleLinear().domain(minMax).range([gHeight, 0]);

  $: qqqPath = `M${data.timeseries.qqq.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`;
  $: spxPath = `M${data.timeseries.spx.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`;
  $: accountPath = `M${data.timeseries.account.map(p => `${xScale(parseDate(p.date))},${yScale(p.value)}`).join('L')}`;
  onMount(() => {
    // Spaghetti
    const values = [
      ...data.timeseries.spx.map(item => item.value),
      ...data.timeseries.qqq.map(item => item.value),
      ...data.timeseries.account.map(item => item.value)
    ].sort((n1, n2) => n1 - n2);
    const abs = Math.max(Math.abs(100 - Math.min(...values)), Math.abs(100 - Math.max(...values)));
    minMax = [100 - abs - 5, 100 + abs + 5];
    const dates = data.timeseries.spx.map(item => item.date).sort();
    dateRange = [parseDate(dates[0]), parseDate(dates[dates.length - 1])];
  })
</script>

<div class="w-full h-full p-4 bg-green-400">
  <svg width={gWidth} height={gHeight} viewBox={`0 0 ${gWidth} ${gHeight}`}>
    <rect width="100%" height="100%" stroke-width="2" stroke="black" fill="none" />
    <!-- yAxis -->
    <g opacity="0.5">
      {#each yTicks as tick}
        <g transform={`translate(0,${yScale(tick)})`}>
          <line x1="0%" x2="100%" y1="1" y2="1" stroke="gray" />
        </g>
      {/each}
    </g>
    <!-- xAxis -->
    <g opacity="0.5">
      {#each xTicks as tick}
        <g transform={`translate(${xScale(tick)},0)`}>
          <line y1="0%" y2="100%" x1="1" x2="1" stroke="gray" />
        </g>
      {/each}
    </g>
    <!-- QQQ -->
    <path fill="none" stroke="black" stroke-width={2} stroke-linecap="round" stroke-linejoin="round" d={qqqPath} />
    <!-- SPX -->
    <path fill="none" stroke="black" stroke-width={2} stroke-linecap="round" stroke-linejoin="round" d={spxPath} />
    <!-- Account -->
    <path fill="none" stroke="black" stroke-width={2} stroke-linecap="round" stroke-linejoin="round" d={accountPath} />
  </svg>
</div>