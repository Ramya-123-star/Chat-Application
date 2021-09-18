import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Grid, Row, Col } from 'rsuite';
import Sidebar from '../../components/Sidebar';
import { GroupsProvider } from '../../context/groups.context';
import { useMediaQuery } from '../../misc/custom-hooks';
import Chat from './Chat';

const Home = () => {
  const isDesktop = useMediaQuery('(min-width: 992px)');
  const { isExact } = useRouteMatch();
  const canRenderSidebar = isDesktop || isExact;
  return (
    <GroupsProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {canRenderSidebar && (
            <Col xs={24} md={8} className="h-100">
              <Sidebar />
            </Col>
          )}
          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="h-100">
                <Chat />
              </Col>
            </Route>
            <Route>
              {isDesktop && (
                <Col>
                  <h6 className="text-center mt-page">
                    Please select a chat...
                  </h6>
                </Col>
              )}
            </Route>
          </Switch>
        </Row>
      </Grid>
    </GroupsProvider>
  );
};

export default Home;
