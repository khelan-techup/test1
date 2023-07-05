import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        {/* <span>Neo7 &copy; 2023 Neo7Bioscience.</span> */}
        <span>&copy; Copyright 2023 Neo7Bioscience, Inc</span>
        <span className="ml-auto">Powered by <a href="https://www.neo7bioscience.com/" target="_blank">Neo7Bioscience, Inc</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
