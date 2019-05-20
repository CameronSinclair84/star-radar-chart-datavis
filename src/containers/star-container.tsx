import * as React from "react";
import PageIntro from "../components/page-intro";
import { IStarDataSets } from "../utilities";
import Star from "../components/star";
import { firestore } from "../firebase";
import styles from "./star-page-container.module.scss";
import { IStarData } from "../utilities";

export interface IProps {}
export interface IState {
  ourData: IStarData;
  pointSize: number;
}

class StarContainer extends React.Component<IProps, IState> {
  public categoryLabelsFromDB: string[] = [];
  public categoryScoresFromDB: number[] = [];
  public starData: IStarDataSets[] = [];
  public dataRetrievedFromDB!: firebase.firestore.DocumentData[];
  public scoresWithFakeDataPoints: number[] = [];
  public starLabel: string[] = [];

  public divider: number = 1.3;
  public sharpness: number = 0.3;
  public numberOfDatasets: number = 1;

  public state = {
    // pointSize controls the size of the data points, fake data points are hardcoded hidden - C.S.
    pointSize: 2,
    // "empty" initial state for the data object - C.S.
    ourData: {
      labels: [],
      datasets: [
        {
          label: "Star 1",
          data: [],
          backgroundColor: "rgba(101, 68, 155, 0.4)",
          borderColor: "rgba(110, 203, 211, 0.8)",
          pointRadius: [1],
          lineTension: 0.4,
          borderWidth: 1
        }
      ]
    }
  };

  public componentDidMount = () => {
    firestore
      .collection("questionnaires")
      .get()
      .then(querySnapshot => {
        this.dataRetrievedFromDB = querySnapshot.docs.map(document =>
          document.data()
        );

        // Mapping data from database to our variables - C.S.
        // Inserting empty string between each label for purpose of fake data points - C.S.

        this.dataRetrievedFromDB[52].categoryResults.map((element: any) => {
          this.categoryLabelsFromDB.push(element.categoryName);
          this.categoryLabelsFromDB.push("");
          this.categoryScoresFromDB.push(element.categoryAverage);
        });

        // Creating the label consisting of the users name and the date they completed the questionnaire

        this.starLabel[0] =
          this.dataRetrievedFromDB[52].user.displayName +
          " - " +
          this.dataRetrievedFromDB[52].date
            .toDate()
            .toString()
            .slice(0, 25);

        // Data to be passed to star component. Can change colours etc here - C.S.

        this.starData[0] = {
          label: "Star 1",
          data: this.buildFakeDataArray(this.categoryScoresFromDB),
          backgroundColor: "rgba(101, 68, 155, 0.6)",
          borderColor: "rgba(110, 203, 211, 0.8)",
          pointRadius: this.buildPointSizeArray(),
          lineTension: this.sharpness,
          borderWidth: 1
        };

        // Setting state ready to pass data object to star component - C.S.

        this.setState({
          ourData: {
            ...this.state.ourData,
            labels: this.categoryLabelsFromDB,
            datasets: [...this.starData]
          }
        });
      });
  };

  public updateStar = (event: React.MouseEvent) => {
    this.starLabel = [];
    for (let i = 0; i < this.numberOfDatasets; i++) {
      const tempDataSet: number[] = [];
      const randomID = Math.floor(
        Math.random() * this.dataRetrievedFromDB.length
      );
      this.dataRetrievedFromDB[randomID].categoryResults.map((element: any) => {
        tempDataSet.push(element.categoryAverage);
      });
      this.starData[i] = {
        label: "Star " + (i + 1),
        data: this.buildFakeDataArray(tempDataSet),
        backgroundColor: "rgba(101, 68, 155, 0.6)",
        borderColor: "rgba(110, 203, 211, 0.8)",
        pointRadius: this.buildPointSizeArray(),
        lineTension: this.sharpness,
        borderWidth: 1
      };
      this.starLabel[i] =
        this.dataRetrievedFromDB[randomID].user.displayName +
        " - " +
        this.dataRetrievedFromDB[randomID].date
          .toDate()
          .toString()
          .slice(0, 25);
    }

    this.setState({
      ourData: {
        ...this.state.ourData,
        labels: this.categoryLabelsFromDB,
        datasets: [...this.starData]
      }
    });
  };

  public render() {
    return (
      <React.Fragment>
        <div className={styles.wrapper}>
          <Star chartData={this.state.ourData} />

          <div className={styles.pageText}>
            <PageIntro heading="WELCOME TO YOUR PERSONAL STAR">
              The power of the star is in its visual representation of how you
              scored each area of your life. The key is not to focus on the
              elements with lower score but to think what would I like to
              improve. Always be thinking where am I now and where would I like
              to be in a month year etc. Let you aims goals and desires drive
              the tasks you set for yourself.
              <br />
              <br />
              <div className={styles.sliderBars}>
                Change star curve:
                <input
                  name="sharp"
                  type="range"
                  min="0"
                  max="6"
                  value={this.sharpness * 10}
                  className={styles.slider}
                  onChange={() => this.handleEvent(window.event, 1)}
                />
                <br />
                <br />
                Change star aggressiveness:
                <input
                  name="aggr"
                  type="range"
                  min="0"
                  max="10"
                  value={this.divider * 10 - 10}
                  className={styles.slider}
                  onChange={() => this.handleEvent(window.event, 2)}
                />
              </div>
              <br />
              Showing Star Data for:
              <br />
              {this.starLabel.map((eachLabel, index) => (
                <span>
                  {"Star " + (index + 1) + " - "}
                  {eachLabel}
                  <br />
                </span>
              ))}
              <br />
              <button onClick={this.updateStar}>Get new data</button>
              <br />
              <br />
              <div onClick={this.handleAddDataset}>Add dataset</div>
              <br />
              <div onClick={this.handleRemoveDataset}>Remove dataset</div>
            </PageIntro>
          </div>
        </div>
      </React.Fragment>
    );
  }

  public handleRemoveDataset = () => {
    if (this.numberOfDatasets <= 0) {
      return;
    }
    this.numberOfDatasets--;
    this.starLabel.pop();
    this.starData.pop();
    this.setState({
      ourData: {
        ...this.state.ourData,
        labels: this.categoryLabelsFromDB,
        datasets: [...this.starData]
      }
    });
  };

  public handleAddDataset = () => {
    this.numberOfDatasets++;
    const tempDataSet: number[] = [];
    const randomID = Math.floor(
      Math.random() * this.dataRetrievedFromDB.length
    );
    this.dataRetrievedFromDB[randomID].categoryResults.map((element: any) => {
      tempDataSet.push(element.categoryAverage);
    });
    this.starData.push({
      label: "Star " + this.numberOfDatasets,
      data: this.buildFakeDataArray(tempDataSet),
      backgroundColor: "rgba(101, 68, 155, 0.6)",
      borderColor: "rgba(110, 203, 211, 0.8)",
      //   backgroundColor: this.random_rgba(),
      //   borderColor: this.random_rgba(), // canvas gradient here
      pointRadius: this.buildPointSizeArray(),
      lineTension: this.sharpness,
      borderWidth: 1
    });

    this.starLabel.push(
      this.dataRetrievedFromDB[randomID].user.displayName +
        " - " +
        this.dataRetrievedFromDB[randomID].date
          .toDate()
          .toString()
          .slice(0, 25)
    );

    this.setState({
      ourData: {
        ...this.state.ourData,
        labels: this.categoryLabelsFromDB,
        datasets: [...this.starData]
      }
    });
  };

  public handleEvent = (event: any, val: number) => {
    switch (val) {
      case 1:
        this.sharpness = event.target.value / 10;
        for (let i = 0; i < this.numberOfDatasets; i++) {
          this.starData[i] = {
            ...this.starData[i],
            lineTension: this.sharpness
          };
        }

        this.setState({
          ourData: {
            ...this.state.ourData,
            datasets: [...this.starData]
          }
        });
        break;
      case 2:
        this.divider = event.target.value / 10 + 1;
        for (let i = 0; i < this.numberOfDatasets; i++) {
          const tempData: number[] = [];
          for (let j = 0; j < 17; j += 2) {
            tempData.push(this.starData[i].data[j]);
          }

          this.starData[i] = {
            ...this.starData[i],
            data: this.buildFakeDataArray(tempData)
          };
        }

        this.setState({
          ourData: {
            ...this.state.ourData,
            datasets: [...this.starData]
          }
        });
        break;

      default:
        break;
    }
  };

  // Random rgba colour generator

  public random_rgba = () => {
    const o = Math.round;
    const r = Math.random;
    const s = 255;
    return (
      "rgba(" +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      r().toFixed(1) +
      ")"
    );
  };

  // Inserting fake data points into our dataset

  public buildFakeDataArray = (arr: number[]): number[] => {
    const returnedArray = [];
    for (let i = 0; i < arr.length; i++) {
      returnedArray.push(arr[i]);
      if (i === arr.length - 1) {
        if (arr[i] > arr[0]) {
          returnedArray.push(arr[0] / this.divider);
        } else {
          returnedArray.push(arr[i] / this.divider);
        }
      } else if (arr[i] > arr[i + 1]) {
        returnedArray.push(arr[i + 1] / this.divider);
      } else {
        returnedArray.push(arr[i] / this.divider);
      }
    }
    return returnedArray;
  };

  // Set zero pointsize for our fake data points so they don't appear on the star

  public buildPointSizeArray = () => {
    const returnedArray = [];
    for (let i = 0; i < 9; i++) {
      returnedArray.push(this.state.pointSize);
      returnedArray.push(0);
    }
    return returnedArray;
  };
}

export default StarContainer;
