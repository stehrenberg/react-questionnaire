import React, {Component} from 'react';
import Question from './Question';
import SaveBtn from '../components/SaveBtn';

import appConfig from '../config/config.json'

class Questionnaire extends Component {

    constructor(props) {
        super(props);

        this.state = {
            questions: this.props.questions,
            isSaved: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveForm = this.saveForm.bind(this);
        this.getQuestionValuesAsArray = this.getQuestionValuesAsArray.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        if(!this.props.isReadOnly) {
            this.saveForm();
        }
    }

    handleChange(name, value) {

        const questions = this.state.questions;
        const targetQuestion = questions.find((question) => question.id === name);
        targetQuestion.value = value;

        this.setState({ questions: questions });
        localStorage.setItem(this.props.id, JSON.stringify(this.state.questions, ["id", "value"]));
    }

    render() {
        return (
            <div className="Questionnaire">
                <h2>Goals</h2>
                <p>
                    <strong>We would like to improve the quality of the services we supply continuously. We need our customers' help to achieve this, to help us align to his targets give us ideas of what competences to build and where to improve.</strong>
                </p>
                <form action="" method="" onSubmit={ (event) => this.handleSubmit(event) }>
                    {
                        this.state.questions.map(
                            question => <Question key={ question.id }
                                                  name={ question.id }
                                                  label={ question.text }
                                                  value={ question.value }
                                                  onChange={ this.handleChange }
                                                  isReadOnly={ this.props.isReadOnly }
                                {...question} />)
                    }
                    { this.props.isReadOnly ? null : <div className="save-btn"><SaveBtn /></div> }
                </form>
            </div>
        );
    }

    saveForm() {
        const surveyEndpoint = `${appConfig.dreamfactoryApi.apiBaseUrl}_table/survey`;
        const questionsAsArray = this.getQuestionValuesAsArray();
        const httpMethod = this.state.isSaved ? 'PATCH' : 'POST';

        this.createNewSurveyRecord(surveyEndpoint, httpMethod).then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                console.log(response.error);
            }
        }).then(() => this.createNewSurveyResultRecord(httpMethod, questionsAsArray)
        ).then((response) => {
            if(response.ok) {
                this.setState({ isSaved: true });
                return response.json();
            } else {
                console.log(response.error);
            }
        }).catch(err => {
            console.log("error!");
            console.log(err);
        });
    }

    createNewSurveyRecord(surveyEndpoint, httpMethod) {
        return fetch(surveyEndpoint, {
            method: httpMethod,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-DreamFactory-Api-Key': appConfig.dreamfactoryApi.apiKey
            },
            body: JSON.stringify({
                "resource": {
                    "survey_id": this.props.id,
                    "customer_id": "",
                    "created_at": ""
                }
            })
        });
    }

    createNewSurveyResultRecord(httpMethod, questionsAsArray) {
        const surveyResultEndpoint = `${appConfig.dreamfactoryApi.apiBaseUrl}_table/survey_result`;

        return fetch(`${surveyResultEndpoint}?id_field=survey_id%2C%20question_id`, {
            method: httpMethod,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-DreamFactory-Api-Key': appConfig.dreamfactoryApi.apiKey
            },
            body: JSON.stringify({
                "resource": questionsAsArray,
            }),
        })
    }

    getQuestionValuesAsArray() {
        return this.state.questions.map((question, index) => {
            return {
                "survey_id" : this.props.id,
                "question_id" : index+1,
                "question_answer" : question.value,
            };
        });
    }
}

export default Questionnaire;