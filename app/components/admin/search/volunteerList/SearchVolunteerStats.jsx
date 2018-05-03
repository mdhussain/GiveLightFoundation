import * as React from 'react';
import { Chart } from 'react-google-charts';
import Paper from 'material-ui/Paper';
require('./SearchVolunteerStats.css')
require('../../../sharedCss.css')

class SearchVolunteerStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteerStats: {},
            timestamp: null,
            pieChart: { showToolTip: false, top:0,left:0, value:'',key:''}
        }
        this.componentWillReceiveProps(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.timestamp != nextProps.timestamp) {
            let statsData = Object.keys(nextProps.volunteerStats).map( (key) => {
                return [key, nextProps.volunteerStats[key]];
            });
            statsData.unshift(['skills', 'count']);
            console.log(statsData);
            this.state = {
                ...this.state,
                volunteerStats: statsData,
                timestamp: nextProps.timestamp
            }
        }
    }

    chartOptions = () => {
        return {
            legend: {position: 'none'},
            backgroundColor: {stroke: 'lightgrey', fill: '#FAFAFA', strokeWidth: '1'},
            chartArea: {width:'270',height:'270', top: '30', left: '30'},
            width: '320',
            height: '320',
            tooltip: {showColorCode: true},
        }
    }

    render() {
        return (
               <Chart
                chartType="PieChart"
                data={this.state.volunteerStats}
                options={this.chartOptions()} 
                graph_id="PieChart"
                legend_toggle
                />
            )
    }
}

export default SearchVolunteerStats
