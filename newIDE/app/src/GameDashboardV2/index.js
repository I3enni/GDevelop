// @flow

import * as React from 'react';
import { type Game } from '../Utils/GDevelopServices/Game';
import { ColumnStackLayout } from '../UI/Layout';
import GameHeader from './GameHeader';
import DashboardWidget from './DashboardWidget';
import { Trans } from '@lingui/macro';
import FlatButton from '../UI/FlatButton';
import ArrowRight from '../UI/CustomSvgIcons/ArrowRight';
import { Grid } from '@material-ui/core';
import FeedbackWidget from './FeedbackWidget';
import { listComments, type Comment } from '../Utils/GDevelopServices/Play';
import { getBuilds, type Build } from '../Utils/GDevelopServices/Build';
import AuthenticatedUserContext from '../Profile/AuthenticatedUserContext';
import Text from '../UI/Text';
import AnalyticsWidget from './AnalyticsWidget';

type Props = {|
  game: Game,
  analyticsSource: 'profile' | 'homepage' | 'projectManager',
|};

const GameDashboardV2 = ({ game }: Props) => {
  const { getAuthorizationHeader, profile } = React.useContext(
    AuthenticatedUserContext
  );
  const [view, setView] = React.useState<
    'game' | 'analytics' | 'feedbacks' | 'builds' | 'services'
  >('game');
  const [feedbacks, setFeedbacks] = React.useState<?Array<Comment>>(null);
  const [builds, setBuilds] = React.useState<?Array<Build>>(null);

  React.useEffect(
    () => {
      if (!profile) {
        setFeedbacks(null);
        setBuilds(null);
        return;
      }

      const fetchData = async () => {
        const [feedbacks, builds] = await Promise.all([
          listComments(getAuthorizationHeader, profile.id, {
            gameId: game.id,
            type: 'FEEDBACK',
          }),
          getBuilds(getAuthorizationHeader, profile.id, game.id),
        ]);
        setFeedbacks(feedbacks);
        setBuilds(builds);
      };

      fetchData();
    },
    [getAuthorizationHeader, profile, game.id]
  );

  return (
    <ColumnStackLayout noMargin>
      <GameHeader game={game} />
      <Grid container spacing={2}>
        <AnalyticsWidget onSeeAll={() => setView('analytics')} />
        <FeedbackWidget
          onSeeAll={() => setView('feedbacks')}
          feedbacks={feedbacks}
        />
        <DashboardWidget
          gridSize={3}
          title={<Trans>Exports</Trans>}
          seeMoreButton={
            <FlatButton
              label={<Trans>See all</Trans>}
              rightIcon={<ArrowRight fontSize="small" />}
              onClick={() => setView('builds')}
              primary
            />
          }
          renderSubtitle={
            !builds
              ? null
              : () => (
                  <Text color="secondary" size="body-small" noMargin>
                    {builds.length <
                    // Hardcoded value in the back.
                    // TODO: replace with pagination.
                    100 ? (
                      <Trans>{builds.length} exports created</Trans>
                    ) : (
                      <Trans>100+ exports created</Trans>
                    )}
                  </Text>
                )
          }
        />
      </Grid>
    </ColumnStackLayout>
  );
};

export default GameDashboardV2;