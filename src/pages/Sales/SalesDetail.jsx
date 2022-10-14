import React from "react";
import { SERVER_APP } from "../../constants/config";
import Skeleton from "react-loading-skeleton";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../service/news.service";
import { Page, Link, Navbar, Toolbar } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import Slider from "react-slick";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      ListSales: [],
      CurrentSales: null,
      loading: true,
      showPreloader: false,
      width: window.innerWidth,
    };
  }

  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  componentDidMount() {
    const paramsID = this.$f7route.params.postId;
    this.getListSales();

    // NewsDataService.getDetailNew(paramsID)
    //   .then((response) => {
    //     this.setState({
    //       arrayItem: response.data.data[0],
    //       isLoading: false,
    //     });
    //   })
    //   .catch((er) => console.log(er));
  }

  getListSales = () => {
    const { id } = this.$f7route.params;
    NewsDataService.getNewsIdCate("11183")
      .then(({ data }) => {
        let ListSales = data?.data ? data.data.sort((a, b) => a.id - b.id) : [];
        let CurrentSales = null;
        if (id) {
          const curentIndex = ListSales.findIndex(
            (item) => Number(item.id) === Number(id)
          );
          if (curentIndex > -1) {
            CurrentSales = ListSales[curentIndex];
            ListSales = ListSales.filter(
              (item) => Number(item.id) !== Number(id)
            ).slice(0, 3);
          }
        } else {
          CurrentSales = ListSales.length > 0 ? ListSales[0] : null;
          ListSales = ListSales.slice(1, 4);
        }

        this.setState({
          ListSales,
          CurrentSales: CurrentSales,
          loading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  loadRefresh(done) {
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
      });
      done();
    }, 1000);
  }

  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  render() {
    const { ListSales, loading, CurrentSales } = this.state;

    const settingsBanner = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <Page
        name="news-list-detail"
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link className="w-48px" href="/">
                <i className="las la-home"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              {!loading ? (
                <span className="title">{CurrentSales?.text}</span>
              ) : (
                <span className="title">Loading ...</span>
              )}
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render p-0 no-bg">
          {!loading && CurrentSales ? (
            <div className="page-render p-0 no-bg">
              <div className="page-news">
                <div className="page-news__detail">
                  <div className="page-news__detail-img">
                    <img
                      className="w-100"
                      src={SERVER_APP + CurrentSales.source.Thumbnail_web}
                    />
                  </div>
                  <div className="page-news__detail-content">
                    <div className="page-news__detail-shadow">
                      <div className="title-news">{CurrentSales.text}</div>
                      {ReactHtmlParser(
                        this.fixedContentDomain(CurrentSales.source.Desc)
                      )}
                      {ReactHtmlParser(
                        this.fixedContentDomain(CurrentSales.source.Content)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="page-news">
              <div className="page-news__detail">
                <div className="page-news__detail-img">
                  <Skeleton height={180} />
                </div>
                <div className="page-news__detail-content">
                  <div className="page-news__detail-shadow">
                    <Skeleton count={14} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white p-15px">
            <div className="text-ezs mb-15px text-uppercase fw-700 font-size-md">
              Ưu đãi khác
            </div>
            <div className="page-news__list-ul">
              <Slider {...settingsBanner}>
                {ListSales &&
                  ListSales.map((item, index) => (
                    <Link
                      href={`/sale/${item.id}`}
                      className="page-news__list-item"
                      key={index}
                      style={this.handStyle()}
                    >
                      <div className="images">
                        <img
                          src={SERVER_APP + item.source.Thumbnail_web}
                          alt={item.source.Title}
                        />
                      </div>
                      <div className="text">
                        <h6>{item.source.Title}</h6>
                        <div className="desc">
                          {ReactHtmlParser(item.source.Desc)}
                        </div>
                      </div>
                    </Link>
                  ))}
              </Slider>
            </div>
          </div>
        </div>

        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
