<script lang="ts">
  import { onMount } from 'svelte';
  import TailwindCss from './TailwindCSS.svelte';
  import LoadingIndicator from './LoadingIndicator.svelte';
  import ErrorScreen from './ErrorScreen.svelte';
  import StatsScreen from './StatsScreen.svelte';

  const tempData: IData = {
    timeseries: {
      spx: [
        { date: '2023-04-10', value: 100 },
        { date: '2023-04-11', value: 101 },
        { date: '2023-04-12', value: 102 },
        { date: '2023-04-13', value: 103 },
        { date: '2023-04-14', value: 104 },
        { date: '2023-04-15', value: 105 },
        { date: '2023-04-16', value: 107 },
        { date: '2023-04-17', value: 109 },
        { date: '2023-04-18', value: 111 },
        { date: '2023-04-19', value: 114 },
        { date: '2023-04-20', value: 117 },
        { date: '2023-04-21', value: 120 },
        { date: '2023-04-22', value: 124 },
        { date: '2023-04-23', value: 128 }
      ],
      qqq: [
        { date: '2023-04-10', value: 100 },
        { date: '2023-04-11', value: 102 },
        { date: '2023-04-12', value: 105 },
        { date: '2023-04-13', value: 106 },
        { date: '2023-04-14', value: 108 },
        { date: '2023-04-15', value: 110 },
        { date: '2023-04-16', value: 111 },
        { date: '2023-04-17', value: 114 },
        { date: '2023-04-18', value: 111 },
        { date: '2023-04-19', value: 109 },
        { date: '2023-04-20', value: 107 },
        { date: '2023-04-21', value: 105 },
        { date: '2023-04-22', value: 100 },
        { date: '2023-04-23', value: 95 },
      ],
      account: [
        { date: '2023-04-10', value: 100 },
        { date: '2023-04-11', value: 99 },
        { date: '2023-04-12', value: 97 },
        { date: '2023-04-13', value: 102 },
        { date: '2023-04-14', value: 104 },
        { date: '2023-04-15', value: 106 },
        { date: '2023-04-16', value: 106 },
        { date: '2023-04-17', value: 111 },
        { date: '2023-04-18', value: 111 },
        { date: '2023-04-19', value: 114 },
        { date: '2023-04-20', value: 117 },
        { date: '2023-04-21', value: 124 },
        { date: '2023-04-22', value: 127 },
        { date: '2023-04-23', value: 132 },
      ],
    },
    metadata: {
      alltimeperformance: { value: 66, type: 'percent' },
      ytdperformance: { value: 33, type: 'percent' },
    }
  };

  const isDataValid = (data: any): data is IData => {
    return true;
  }
  
  let loading: boolean | 'failed' = true;
  let data: IData | null;

  onMount(async () => {
    const res = await fetch(``);
    console.log(res);
    if (!res.ok || res.status !== 200) {
      loading = 'failed'
      return;
    };
    try {
      const temp = await res.json();
      if (isDataValid(temp)) {
        data = temp;
      } else {
        throw Error('Data not valid!');
      }
      loading = false;
    } catch (e) {
      // loading = 'failed';
      loading = false;
      data = tempData;
      console.log('error when fetching data', e);
    }
  });

</script>

<TailwindCss />

<div class="flex w-screen h-screen bg-light-accent">
  <div class="container m-8 bg-light-shades border-4 border-dark-shades rounded-lg">
    {#if loading == true}
    <LoadingIndicator />
    {:else if loading == 'failed'}
    <ErrorScreen />
    {:else if data}
    <StatsScreen data={data} />
    {:else}
    Solmusa
    {/if}
  </div>
</div>
