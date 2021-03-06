import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';

import LogoHeader from '../../components/LogoHeader';
import SurveyDataTable from '../../components/SurveyDataTable';
import MiniNavBar from '../../components/MiniNavBar';
import AlertBox from '../../components/AlertBox';
import { loadSurveys } from '../../actions';
import { config } from '../../config/config'
import { apiCall, normalizeProjectName } from '../../util/utils';
import '../../app.css';

class FormHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAlertBox: false,
        };

        this.previousProjectName = props.projectName;
    }

    componentWillMount() {
        this.loadSurveyData();
    }

    componentDidUpdate() {
        if (this.previousProjectName !== this.props.projectName) {
            this.loadSurveyData();
            this.previousProjectName = this.props.projectName;
        }
    }

    render() {
        const { history, showMiniNavBar } = this.props;
        return (
            <div>
                <LogoHeader title={'Past Questionnaires for' } history={ this.props.history }/>
                <MiniNavBar history={ history } show={ showMiniNavBar }/>
                <SurveyDataTable history={ history }/>
                <AlertBox 
                    show={ this.state.showAlertBox }
                    dialogText={ "No completed surveys to show yet." }
                    btnTexts={ ["Noted!"] }
                    handleClose={ () => this.setState({ showAlertBox: false }) }
                />
            </div>
        );
    }

    loadSurveyData() {
        this.fetchSurveyData().then((surveysDataAsArray) => {
            this.props.dispatch(loadSurveys(surveysDataAsArray.reverse()));
            this.setState({
                showAlertBox: surveysDataAsArray.length === 0,
            });
        }).catch((err) => this.setState({ showAlertBox: true }));
    }

    fetchSurveyData = () => {
        const projectName = normalizeProjectName(this.props.projectName);
        const table = `_table/survey_result_${ projectName }`;
        const surveyResultsEndpoint = `${config.dreamfactoryApi.apiBaseUrl}${ table }`;

        return this.fetchSurveyIdsListForProject(projectName).then((surveyIdList) => {
            const transformationFunc = (data) => this.organizeBySurveyId(data.resource, surveyIdList);
            const errorHandler = (error) => console.log(error);

            return apiCall(surveyResultsEndpoint, 'GET', transformationFunc, errorHandler, {});
        });
    };

    fetchSurveyIdsListForProject(projectName) {
        const table = `_table/survey_${ projectName }`;
        const surveyIdsEndpoint = `${config.dreamfactoryApi.apiBaseUrl}${ table }`;
        const transformationFunc = (data) =>  data.resource.map(resource => resource.survey_id);
        const errorHandler = (error) => console.log(error);

        return apiCall(surveyIdsEndpoint, 'GET', transformationFunc, errorHandler, {});
    }

    organizeBySurveyId(rawData, surveyIdList) {
        return surveyIdList.map((surveyId) => {
            return {
                surveyId: surveyId,
                data: rawData.filter((resultTuple) => resultTuple.survey_id === surveyId).map(resultTuple => {
                    return {
                        questionId: resultTuple.question_id,
                        questionValue: resultTuple.question_answer,
                    };
                })
            };
        });
    }
}

const mapStateToProps = (state) => ({
    projectName: state.projectName,
    surveys: state.surveys,
    showMiniNavBar: state.showMiniNavBar,
});

export default connect(mapStateToProps)(FormHistory);