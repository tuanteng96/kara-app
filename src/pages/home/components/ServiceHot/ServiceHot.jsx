import React from "react";
import { Link } from "framework7-react";
import Slider from "react-slick";
import NewsDataService from "../../../../service/news.service";
import SkeletonServiceHot from "./SkeletonServiceHot";
import { SERVER_APP } from "../../../../constants/config";
import { validURL } from "../../../../constants/helpers";

export default class ServiceHot extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
      arrBanner: [],
    };
  }

  componentDidMount() {
    this.getBanner();
  }
  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  getBanner = () => {
    NewsDataService.getBannerName(this.props.BannerName)
      .then(({ data }) => {
        const arrBanner = data.data;
        this.setState({
          arrBanner: arrBanner,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { isLoading, arrBanner } = this.state;
    const settingsNews = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
      autoplay: true,
      autoplaySpeed: 5000,
    };
    
    return (
      <React.Fragment>
        {!isLoading && (
          <React.Fragment>
            {arrBanner && arrBanner.length > 0 && (
              <div className="home-page__news mb-8">
                <div className="page-news__list">
                  <div className="page-news__list-ul">
                    <Slider {...settingsNews}>
                      {arrBanner &&
                        arrBanner.map((item, index) => {
                          if (index > 6) return null;
                          return (
                            <Link
                              noLinkClass
                              href={item.Link ? item.Link : `/adv/${item.ID}`}
                              className={`page-news__list-item box-shadow-none d-block  overflow-hidden ${
                                validURL(item.Link) ? "external" : ""
                              }`}
                              key={item.ID}
                              style={this.handStyle()}
                            >
                              <div className="images bd-rd3">
                                <img
                                  src={
                                    SERVER_APP +
                                    "/Upload/image/" +
                                    item.FileName
                                  }
                                  alt={item.Title}
                                />
                              </div>
                            </Link>
                          );
                        })}
                    </Slider>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        {isLoading && (
          <div className="home-page__news mb-8">
            <div className="page-news__list">
              <div className="page-news__list-ul">
                <SkeletonServiceHot />
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
