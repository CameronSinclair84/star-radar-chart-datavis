import * as React from "react";
import { Radar } from "react-chartjs-2";
import styles from "./star.module.scss";
import { IStarData } from "../utilities";

export interface IProps {
  chartData: IStarData;
}

export interface IState {
  chartData: {};
  displayTitle: boolean;
  displayLegend: boolean;
  displayLabel: boolean;
  labelColor: string;
}

class Star extends React.Component<IProps, IState> {
  public state = {
    chartData: {
      labels: [
        "Career",
        "",
        "Family",
        "",
        "Friends",
        "",
        "Fun & Leisure",
        "",
        "Health & Wellbeing",
        "",
        "Money",
        "",
        "Personal Growth",
        "",
        "Physical Environment",
        "",
        "Relationships",
        ""
      ],

      datasets: [
        {
          label: "Star 1",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
          pointRadius: 1,
          lineTension: 0.1
        }
      ]
    },
    displayTitle: false,
    displayLegend: false,
    displayLabel: false,
    labelColor: "#fff"
  };

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    if (nextProps !== this.props) {
      this.setState({
        chartData: {
          datasets: nextProps.chartData.datasets,
          labels: nextProps.chartData.labels
        }
      });
      return false;
    }
    if (nextState !== this.state) {
      return true;
    }
    return false;
  }

  public render() {
    const labelColor = this.state.labelColor;

    return (
      <div className={styles.starSide}>
        <Radar
          data={this.state.chartData}
          // height={1}
          // width={1}
          options={{
            maintainAspectRatio: false,
            reponsive: false,

            title: {
              display: this.state.displayTitle
            },
            layout: {
              padding: {
                left: 0,
                right: 50,
                top: 0,
                bottom: 0
              }
            },
            tooltips: {
              enabled: true
            },
            animation: {
              duration: 1000, // milliseconds
              easing: "easeInOutExpo"
            },
            legend: {
              display: this.state.displayLegend,
              position: "right",
              labels: { display: true }
            },
            scale: {
              ticks: {
                display: false,
                beginAtZero: true,
                max: 10,
                stepSize: 5
              },
              pointLabels: {
                fontColor: labelColor,
                fontSize: 10
              },
              angleLines: {
                display: true,
                lineWidth: 1.5,
                color: "rgba(255, 255, 255, 0.08)"
              },
              gridLines: {
                color: [
                  "rgba(255, 255, 255, 0.08)",
                  "rgba(255, 255, 255, 0.08)"
                ]
              }
            },
            scales: {
              display: false
            }
          }}
        />
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener("resize", this.showHideLabels);
  }

  public UNSAFE_componentWillMount() {
    this.showHideLabels();
  }

  private showHideLabels = () => {
    if (window.innerWidth < 500) {
      this.setState({
        ...this.state,
        labelColor: "transparent"
      });
    } else {
      this.setState({
        ...this.state,
        labelColor: "#fff"
      });
    }
  };
}

export default Star;
