import React from "react";
import PropTypes from "prop-types";
import { Col, Link, Row } from "framework7-react";
import { useState } from "react";
import ShopDataService from "../../../../service/shop.service";
import { getStockIDStorage } from "../../../../constants/user";
import { useEffect } from "react";
import { SERVER_APP } from "../../../../constants/config";

ServiceTags.propTypes = {};

function ServiceTags({ tag }) {
  const [ListServices, setListServices] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    getListServices();
  }, []);

  const getListServices = () => {
    setLoading(true);
    let stockid = getStockIDStorage();
    stockid ? stockid : 0;

    ShopDataService.getServiceParent(795, stockid, 1, 4, 1, "", tag, 0)
      .then(({ data }) => {
        const { lst } = data;
        setListServices(lst);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="home-page__product mt-5px">
      <div className="head">
        <h5>
          <Link href="/shop/794/">
            Sản phẩm
            {Number(tag) === 1 && <span className="pl-4px">mới</span>}
            {Number(tag) === 2 && <span className="pl-4px">HOT</span>}
            {Number(tag) === 3 && <span className="pl-4px">Sale</span>}
            {/* <i className="las la-angle-right"></i> */}
          </Link>
        </h5>
      </div>
      <div className="body pb-0">
        <Row>
          {ListServices &&
            ListServices.map((item, index) => (
              <Col width="50" key={index}>
                <Link
                  href={`/shop/list/795/${item.root.Cates[0].ID}/?ids=${
                    item.root.ID
                  }&cateid=${item.root.Cates[1].ID}&index=${
                    item.root.RootIndexs.length === 1
                      ? item.root.RootIndexs[0] + 1
                      : item.root.RootIndexs[1] + 1
                  }`}
                  className="page-shop__list-item mb-15px"
                >
                  <div className="page-shop__list-img">
                    <img
                      src={SERVER_APP + "/Upload/image/" + item.root.Thumbnail}
                      alt={item.root.Title}
                    />
                  </div>
                  <div className="page-shop__list-text h-auto pb-0">
                    <h3>{item.root.Title}</h3>
                  </div>
                </Link>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}

export default ServiceTags;
