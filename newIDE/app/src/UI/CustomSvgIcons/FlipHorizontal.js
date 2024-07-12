import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default React.memo(props => (
  <SvgIcon {...props} width="24" height="24" viewBox="2 2 20 20" fill="none">
    <path
      d="M4.5 17.5C4.2355 17.5 3.99056 17.3607 3.85537 17.1333C3.72018 16.906 3.71473 16.6243 3.84103 16.3919L10.091 4.89187C10.2548 4.59046 10.6023 4.43861 10.9348 4.52312C11.2672 4.60763 11.5 4.90696 11.5 5.25001V16.75C11.5 17.1642 11.1642 17.5 10.75 17.5H4.5Z"
      fill="currentColor"
    />
    <path
      d="M20.1446 17.1333C20.0094 17.3607 19.7645 17.5 19.5 17.5H13.25C12.8358 17.5 12.5 17.1642 12.5 16.75V5.25001C12.5 4.90696 12.7328 4.60763 13.0652 4.52312C13.3977 4.43861 13.7452 4.59046 13.909 4.89187L20.159 16.3919C20.2853 16.6243 20.2798 16.906 20.1446 17.1333ZM14 8.20065V16H18.2388L14 8.20065Z"
      fill="currentColor"
    />
  </SvgIcon>
));