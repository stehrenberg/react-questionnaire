import React, { Component } from 'react';

import TileMenu from '../../components/TileMenu';
import LogoHeader from '../../components/LogoHeader';
import AddQuestionnaireIcon from '../../assets/add-questionnaire_icon.png'
import HistoryIcon from '../../assets/history_icon.png'

import './menuPage.css';

class MenuPage extends Component {

    render() {

        const tileData = [
            {
                img: AddQuestionnaireIcon,
                title: "New Survey",
                link: "/feedback"
            },
            {
                img: HistoryIcon,
                title: "Past Surveys",
                link: "/form-history"
            },
            {
                img: HistoryIcon,
                title: "...",
                link: "/form-history"
            },
            {
                img: HistoryIcon,
                title: "...",
                link: "/form-history"
            },
            {
                img: HistoryIcon,
                title: "...",
                link: "/form-history"
            },
            {
                img: HistoryIcon,
                title: "...",
                link: "/form-history"
            },
        ];

        return (
            <div>
                <LogoHeader title="Overview" />
                <TileMenu className="TileMenu"
                          tileData={ tileData } />
            </div>
        );
    }
}

export default MenuPage;