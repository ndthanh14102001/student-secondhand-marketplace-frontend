import React, { useEffect } from 'react';
import FacebookSharpIcon from '@mui/icons-material/FacebookSharp';

const Like = ({ dataHref }) => {

    // let shareImageURL = "https://chosinhvien.site/uploads/Are_the_Samsung_Galaxy_Z_Fold_3_and_Z_Flip_3_01_f2fa512bc4.webp";
    // let encodedShareImageURL = encodeURIComponent(shareImageURL);

  useEffect(() => {
    const initFacebookSDK = () => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v16.0'
        });
      };
      // Load the SDK asynchronously
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/vi_VN/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    initFacebookSDK();
  }, []);

  const urlShare = `https://www.facebook.com/dialog/send?app_id=${encodeURIComponent(process.env.REACT_APP_FACEBOOK_APP_ID)}&link=${encodeURIComponent(dataHref)}&redirect_uri=https://www.domain.com/`;

  return (
    <>
      <div
        // className="fb-share-button"
        data-href={dataHref}
        data-layout="button_count"
      >
        <a
            target="_blank"
            //   href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dataHref)}&amp;src=sdkpreparse`}
            href= {urlShare}
            className="fb-xfbml-parse-ignore"
        >
            <img alt="messenger" src="https://static.chotot.com/storage/chotot-icons/svg/circle-messenger.svg" loading="lazy" height="40" width="40" />
        </a>
      </div>
    </>
  );
}

export default Like;
