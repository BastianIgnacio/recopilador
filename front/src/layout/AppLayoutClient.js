import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// import Sidebar from 'containers/navs/Sidebar';
// import Footer from 'containers/navs/FooterClient';

// eslint-disable-next-line no-unused-vars
const AppLayout = ({ containerClassnamesClientApp, children, history }) => {
  return (
    <div className={containerClassnamesClientApp}>
      <div className="container-fluid" style={{ marginTop: '30px' }}>
        {children}
      </div>
    </div>
  );
};
const mapStateToProps = ({ menu }) => {
  const { containerClassnamesClientApp } = menu;
  return { containerClassnamesClientApp };
};
const mapActionToProps = {};

export default withRouter(
  connect(mapStateToProps, mapActionToProps)(AppLayout)
);
