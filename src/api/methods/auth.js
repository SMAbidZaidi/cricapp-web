import {
  postRequest,
  getRequest,
  postWithFormRequest,
  getFilterRequest,
  deleteRequest,
  getParamsRequest,
} from '../index';

export const LoginAPI = payload => postRequest('/auth/local', payload);
export const RegisterAPI = payload => postRequest('/auth/local/register', payload);
export const ForgotPasswordAPI = payload => postRequest('/auth/forgot-password-otp', payload);
export const VerifyOtpAPI = payload => postRequest('/auth/verify-otp', payload);
export const ResetPasswordOtpAPI = payload => postRequest('/auth/reset-password-otp', payload);
export const HomeAPI = () => getRequest('/homescreen/index');
export const NewsAPIForTrendsNew = () => getRequest('/posts/news-index');

export const getPost = id => {
  const url = `/posts/${id}`;
  return getParamsRequest(url);
};

// cricbuzz
export const MatchesListAPIForMatches = type => getParamsRequest('/cricbuzz/matches/list', { type });
export const NewsAPIForTrends = () => getRequest('/cricbuzz/news/list');
export const SeriesListAPI = type => getParamsRequest('/cricbuzz/series/list', { type });
export const NewsListAPI = type => getParamsRequest('posts/news-index', { type });
export const TeamsListAPI = type => getParamsRequest('/cricbuzz/teams/list', { type });

export const SeriesGetMatchesListAPI = NewsID => {
  const url = `/cricbuzz/series/get-matches/${NewsID}`;
  return getParamsRequest(url);
};

export const getNewsDetailsAPI = NewsID => {
  const url = `/cricbuzz/news/${NewsID}`;
  return getParamsRequest(url);
};



export const getMatchDetailsAPI = matchId => {
  const url = `/cricbuzz/matches/${matchId}`;
  return getParamsRequest(url);
};
export const getMatchCommentariesAPI = matchId => {
  const url = `/cricbuzz/matches/${matchId}/commentaries`;
  return getRequest(url);
};
export const getMatchScorecardAPI = matchId => {
  const url = `/cricbuzz/matches/${matchId}/scorecard`;
  return getRequest(url);
};
export const getMatchTeamDetailsAPI = (matchId, teamId) => {
  const url = `/cricbuzz/matches/${matchId}/team/${teamId}`;
  return getRequest(url);
};
export const getMatchHighLigtsAPI = matchId => {
  const url = `/cricbuzz/matches/${matchId}/highlights`;
  return getRequest(url);
};
export const getMatchAnalysisAPI = matchId => {
  const url = `/cricbuzz/matches/${matchId}/analysis`;
  return getRequest(url);
};
export const getPlayerDetailAPI = playerId => {
  const url = `/cricbuzz/players/${playerId}`;
  return getRequest(url);
};
