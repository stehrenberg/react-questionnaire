import React, { Component } from 'react';
import Moment from 'moment';

import Questionnaire from '../../components/Questionnaire';
import LogoHeader from '../../components/LogoHeader';
import questions from '../../config/questionTexts.json';

import './FeedbackForm.css';

class FeedbackForm extends Component {

    render() {
        return (
            <div className="FeedbackForm">
                <LogoHeader title="Cooperation Feedback Questionnaire" />
                <div className="App-content">
                    <Questionnaire id={ this.generateId() } questions={ questions.questionTexts } isReadOnly={ false } />
                    <div className="App-footer">
                        <button className="nav-btn" onClick={ this.props.history.goBack }>back to menu</button>
                    </div>
                </div>
            </div>
        );
    }

    generateId() {
        return Moment().format("YYYYMMDD");
    }
}

export default FeedbackForm;
