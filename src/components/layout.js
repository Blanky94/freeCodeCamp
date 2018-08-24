import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import { fetchUser, isSignedInSelector } from '../redux';
import Header from './Header';

import './layout.css';
import './global.css';

const mapStateToProps = createSelector(isSignedInSelector, isSignedIn => ({
  isSignedIn
}));
const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUser }, dispatch);

class Layout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.isSignedIn) {
      this.props.fetchUser();
    }
  }

  render() {
    const { children, disableSettings } = this.props;
    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <Fragment>
            <Helmet
              meta={[
                { name: 'description', content: 'Sample' },
                { name: 'keywords', content: 'sample, something' }
              ]}
              title={data.site.siteMetadata.title}
            />
            <Header disableSettings={disableSettings} />
            <div style={{ marginTop: '38px' }}>{children}</div>
          </Fragment>
        )}
      />
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  disableSettings: PropTypes.bool,
  fetchUser: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);