import React from 'react';
import { Grid } from '@material-ui/core';
export default function Footer() {
  return (
    <>
      <Grid container justifyContent="space-around">
        <div className="flex items-center justify-center" style={{ gap: '8px' }}>
          <div style={{ color: 'black', fontSize: '10px', fontWeight: '500' }}>Powered By</div>
          <svg width="60" height="30" viewBox="0 0 122 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M69.862 22.3642V11.8218H74.9546V30.183H70.0661V26.8471C69.6521 27.9225 68.7734 28.7877 67.813 29.4412C66.8526 30.0962 65.6837 30.4222 64.3049 30.4222C63.0777 30.4222 61.9982 30.1434 61.0646 29.5844C60.1324 29.0284 59.4043 28.2348 58.883 27.2051C58.3604 26.1784 58.0954 24.9461 58.0879 23.5112V11.8203H63.1805V22.6018C63.188 23.6864 63.4799 24.5425 64.0532 25.1731C64.6264 25.8022 65.3963 26.1175 66.3597 26.1175C66.9733 26.1175 67.5465 25.9758 68.0811 25.6925C68.6141 25.4092 69.0475 24.9888 69.378 24.4313C69.7086 23.8737 69.8694 23.1852 69.862 22.3642Z"
              fill="#000000"
            ></path>
            <path d="M83.4374 5.70117V30.1827H78.3447V5.70117H83.4374Z" fill="#000000"></path>
            <path
              d="M102.135 17.344H97.4428C97.3624 16.9449 97.1911 16.5839 96.929 16.261C96.6655 15.9381 96.3215 15.6791 95.8956 15.4842C95.4697 15.2892 94.9605 15.1902 94.3709 15.1902C93.5817 15.1902 92.916 15.3562 92.374 15.6867C91.8319 16.0173 91.5609 16.4575 91.5609 17.0074C91.5609 17.4446 91.7367 17.8162 92.0866 18.1194C92.4365 18.421 93.0382 18.6662 93.8913 18.849L97.2149 19.5192C99.0003 19.8848 100.33 20.4758 101.207 21.2877C102.084 22.1011 102.522 23.1689 102.522 24.4911C102.522 25.6945 102.169 26.7501 101.465 27.6579C100.759 28.5673 99.7954 29.2741 98.5715 29.7798C97.3474 30.287 95.9389 30.5399 94.3456 30.5399C91.9154 30.5399 89.9795 30.0326 88.5411 29.0151C87.1102 28.0037 86.2674 26.6282 86.0171 24.8856C85.9964 24.7379 85.9903 24.6891 85.9814 24.5977H91.0219C91.1737 25.3395 91.5401 25.9031 92.1224 26.29C92.7046 26.6769 93.4491 26.8689 94.3575 26.8689C95.2493 26.8689 95.9686 26.6967 96.5151 26.3494C97.0615 26.0021 97.3371 25.5543 97.3459 25.0044C97.3386 24.5429 97.1435 24.1621 96.7608 23.862C96.378 23.5634 95.7884 23.335 94.9917 23.175L91.8126 22.5413C90.0197 22.1834 88.687 21.5619 87.8145 20.6769C86.9419 19.7934 86.5056 18.6662 86.5056 17.2938C86.5056 16.1148 86.8258 15.1003 87.4675 14.2458C88.1093 13.3927 89.0132 12.7362 90.1806 12.2731C91.348 11.8116 92.7165 11.5801 94.2874 11.5801C96.6059 11.5801 98.4331 12.069 99.7686 13.0485C101.087 14.0173 101.862 15.3288 102.096 16.9876C102.099 17.0135 102.117 17.1719 102.135 17.344Z"
              fill="#000000"
            ></path>
            <path
              d="M121.86 22.3041V20.9058C121.86 19.3445 121.641 17.9781 121.202 16.8113C120.764 15.643 120.152 14.6727 119.367 13.9004C118.583 13.1266 117.665 12.5478 116.619 12.1609C115.57 11.7739 114.442 11.582 113.229 11.582C111.428 11.582 109.86 11.9811 108.525 12.7778C107.191 13.5744 106.156 14.6864 105.424 16.1122C104.691 17.5394 104.323 19.1967 104.323 21.0856C104.323 23.0216 104.69 24.6987 105.424 26.1138C106.156 27.5274 107.203 28.6195 108.561 29.3888C109.919 30.1595 111.544 30.5434 113.432 30.5434C114.946 30.5434 116.283 30.3103 117.442 29.8427C118.602 29.3766 119.549 28.7231 120.288 27.8823C121.025 27.043 121.62 25.7436 121.86 24.6118H117.043C116.867 25.0734 116.613 25.4649 116.278 25.7848C115.943 26.1031 115.54 26.3423 115.07 26.5022C114.599 26.6606 114.081 26.7414 113.515 26.7414C112.662 26.7414 111.925 26.5631 111.304 26.2036C110.683 25.8457 110.202 25.3354 109.864 24.6728C109.525 24.0117 109.356 23.2272 109.356 22.3194V22.3072H121.86V22.3041ZM111.264 15.9157C111.858 15.5623 112.541 15.384 113.314 15.384C114.056 15.384 114.707 15.5455 115.269 15.8684C115.832 16.1914 116.272 16.6346 116.59 17.2013C116.909 17.7664 117.068 18.4168 117.068 19.1495H109.365C109.397 18.4884 109.563 17.8852 109.873 17.3384C110.205 16.7443 110.67 16.2706 111.264 15.9157Z"
              fill="#000000"
            ></path>
            <path
              d="M5.74706 10.6437C6.96809 10.5477 8.16383 10.0328 9.09896 9.0991C11.1807 7.01682 11.1807 3.64284 9.09896 1.56056C7.01723 -0.520188 3.643 -0.520188 1.56129 1.56056C-0.520431 3.64284 -0.520431 7.01682 1.56129 9.0991C2.70787 10.2461 4.24756 10.761 5.74706 10.6437Z"
              fill="#2765EB"
            ></path>
            <path
              d="M9.09892 24.3018C10.0341 23.3666 10.5478 22.1708 10.6416 20.9477L10.6431 20.9492C10.8456 18.2652 11.8939 15.7488 13.8207 13.8219C15.7492 11.8935 18.2642 10.8455 20.9489 10.6444L20.9474 10.6429C23.6962 10.4297 25.8614 8.1326 25.8614 5.33135C25.8629 2.3854 23.4773 0 20.5335 0C17.7295 0 15.4334 2.16453 15.222 4.91399L15.2205 4.91246C15.018 7.59794 13.9697 10.1143 12.0428 12.0413C10.1145 13.9697 7.59942 15.0177 4.91463 15.2187L4.91612 15.2203C3.69359 15.3147 2.49786 15.8296 1.56422 16.7618C-0.517501 18.8441 -0.517501 22.218 1.56422 24.3003C3.64296 26.3826 7.01719 26.3826 9.09892 24.3018Z"
              fill="#2765EB"
            ></path>
            <path
              d="M20.5334 14.1387C17.7296 14.1387 15.4334 16.3032 15.222 19.0526L15.2205 19.0511C15.018 21.7366 13.9697 24.253 12.0428 26.1799C10.1145 28.1083 7.59942 29.1563 4.91462 29.3574L4.91612 29.3589C3.69359 29.4534 2.49786 29.9682 1.56422 30.9004C-0.5175 32.9827 -0.5175 36.3567 1.56422 38.439C3.64594 40.5212 7.02017 40.5212 9.10188 38.439C10.037 37.5037 10.5508 36.3079 10.6446 35.0863L10.6461 35.0878C10.8486 32.4039 11.8969 29.8875 13.8237 27.9606C15.7521 26.0322 18.2671 24.9842 20.9519 24.7831L20.9505 24.7816C23.6992 24.5683 25.8643 22.2713 25.8643 19.47C25.8628 16.5241 23.4774 14.1387 20.5334 14.1387Z"
              fill="#2765EB"
            ></path>
            <path
              d="M46.7109 5.70117H37.0527V30.1827H42.2289V22.2466L46.7109 22.2451C50.3249 22.2451 55.4844 20.5239 55.4844 13.9983C55.4844 8.55877 51.811 5.70117 46.7109 5.70117ZM45.7192 18.0973H42.2289V9.93273H45.7192C48.191 9.93273 50.1939 11.2732 50.1939 13.9846C50.1939 17.2382 47.5627 18.0973 45.7192 18.0973Z"
              fill="#000000"
            ></path>
          </svg>
        </div>
      </Grid>
    </>
  );
}