import React from "react";
import PropTypes from "prop-types";
import { checkImageProduct } from "../../../constants/format";
import { PhotoBrowser } from "framework7-react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { SERVER_APP } from "../../../constants/config";

OrderItem.propTypes = {};

function OrderItem({ sub }) {
  const [PhotoWeb, setPhotoWeb] = useState([]);
  const refPhotoWeb = useRef();

  useEffect(() => {
    if (sub.ActualPhoto && sub.ActualPhoto.length > 0) {
      setPhotoWeb(sub.ActualPhoto.map((o) => o.Src));
    } else {
      setPhotoWeb([]);
    }
  }, [sub]);
  return (
    <div className="list-sub-item">
      <div className="img">
        <img src={checkImageProduct(sub.ProdThumb)} />
      </div>
      <div className="text">
        <div className="text-name">{sub.ProdTitle}</div>
        <div className="text-count">
          SL <b className="font-number">x{sub.Qty}</b>
        </div>
        {PhotoWeb && PhotoWeb.length > 0 && (
          <div
            className="view-detail"
            onClick={() => refPhotoWeb?.current?.open(0)}
          >
            <i className="las la-angle-right"></i>
          </div>
        )}
        <PhotoBrowser
          photos={PhotoWeb}
          ref={refPhotoWeb}
          popupCloseLinkText="Đóng"
        />
      </div>
    </div>
  );
}

export default OrderItem;
