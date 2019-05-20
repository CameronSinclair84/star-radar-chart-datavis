export interface IStarData {
  labels: string[];
  datasets: IStarDataSets[];
}

export interface IStarDataSets {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  pointRadius: number[];
  lineTension: number;
  borderWidth: number;
}
