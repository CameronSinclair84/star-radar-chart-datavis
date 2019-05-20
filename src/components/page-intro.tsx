import * as React from "react";
import styles from "./pageintro.module.scss";

export interface IProps {
  heading: string;
}

export interface IState {}

class PageIntro extends React.Component<IProps, IState> {
  // state = { :  }
  public render() {
    return (
      <div className={styles.intro}>
        <h1 className={styles.heading}>{this.props.heading}</h1>
        <section className={styles.text}>{this.props.children}</section>
      </div>
    );
  }
}

export default PageIntro;
