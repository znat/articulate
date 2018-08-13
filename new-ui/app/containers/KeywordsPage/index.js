/**
 *
 * KeywordsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import MainTab from 'components/MainTab';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';
import {
  makeSelectKeywords,
  makeSelectAgent,
} from '../App/selectors';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsPage extends React.Component {

  constructor(){
    super();
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
  }

  state = {
    filter: '',
    currentPage: 1,
    numberOfPages: 10,
  }

  changePage(pageNumber){
    this.setState({
        currentPage: pageNumber
    });
    this.props.onLoadKeywords(this.state.filter, pageNumber);
  }

  movePageBack(){
    let newPage = this.state.currentPage;
    if (this.state.currentPage > 1){
        newPage = this.state.currentPage - 1;
    }
    this.changePage(newPage);
  }

  movePageForward(){
    let newPage = this.state.currentPage;
    if (this.state.currentPage < this.state.numberOfPages){
        newPage = this.state.currentPage + 1;
    }
    this.changePage(newPage);
  }

  onSearchKeyword(filter){
    this.setState({
      filter
    });
    this.props.onLoadKeywords(filter, this.state.currentPage);
  }

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={'Pizza Agent'}
        />
        <MainTab
          enableTabs={true}
          selectedTab={'keywords'}
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          sayingsForm={Link}
          sayingsURL={`/agent/${this.props.agent.id}/sayings`}
          keywordsForm={
            <Form
              agentId={this.props.agent.id}
              onSearchKeyword={this.onSearchKeyword}
              keywords={this.props.keywords}
              onDeleteKeyword={this.props.onDeleteKeyword}
              onCreateKeyword={this.props.onCreateKeyword}
              currentPage={this.state.currentPage}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
            />
          }
        />
      </Grid>
    );
  }
}

KeywordsPage.propTypes = {
  agent: PropTypes.object,
  keywords: PropTypes.array,
  onLoadKeywords: PropTypes.func,
  onDeleteKeyword: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keywords: makeSelectKeywords()
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadKeywords: (filter, page) => {
      console.log(filter, page);
    },
    onDeleteKeyword: (keywordIndex) => {
      console.log(keywordIndex);
    },
    onCreateKeyword: (url) => {
      dispatch(push(url))
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'keywords', saga });

export default compose(
  withSaga,
  withConnect
)(KeywordsPage);