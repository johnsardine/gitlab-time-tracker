import React from 'react';
import apiInstance from '../apiInstance';
import {
  IssueEntry,
} from './IssueEntry.module.scss';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      timer: null,
    };
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.uploadTime = this.uploadTime.bind(this);
  }

  startTimer() {
    this.stopTimer();
    this.setState({
      timer: setInterval(() => {
        this.setState((state) => ({
          time: state.time + 1,
        }));
      }, 1000),
    });
  }
  stopTimer() {
    clearInterval(this.state.timer);
    this.setState({
      timer: null,
    });
  }
  async uploadTime() {
    const {
      time,
    } = this.state;
    if (!(time > 0)) {
      return;
    }
    const {
      _links: {
        self: issueApiUrl,
      },
    } = this.props.issue;
    await apiInstance.post(`${issueApiUrl}/add_spent_time`, {
      duration: `${time}s`,
    });
    this.setState({
      time: 0,
    });
    this.props.updateEntry(this.props.issue);
  }

  render() {
    const {
      web_url,
      title,
      time_stats: {
        total_time_spent,
      },
    } = this.props.issue;
    const {
      startTimer,
      stopTimer,
      uploadTime,
    } = this;
    const {
      time,
    } = this.state;

    return (
      <div className={IssueEntry}>
        {total_time_spent}
        |
        {time}
        <a href={web_url}>{title}</a>
        {
          this.state.timer
          ? <button onClick={stopTimer}>Stop timer</button>
          : <button onClick={startTimer}>Start timer</button>
        }
        <button onClick={uploadTime}>Submit</button>
      </div>
    );
  }
}
