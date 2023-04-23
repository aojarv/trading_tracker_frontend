interface ITimeseries {
  date: string;
  value: number;
}

interface IData {
  timeseries: {
    spx: ITimeseries[];
    qqq: ITimeseries[];
    account: ITimeseries[];
  }
}