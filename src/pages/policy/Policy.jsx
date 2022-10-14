import React from "react";
import { Page, Link, Toolbar, Navbar, Col, Row } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import NewsDataService from "../../service/news.service";
import Skeleton from "react-loading-skeleton";
import { SERVER_APP } from "../../constants/config";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingCate: false,
      TitleCate: "",
      ThumbnailCate: "",
      loading: false,
      List: [],
    };
  }
  componentDidMount() {
    this.getCateID();
    this.getListPolyci();
  }

  getListPolyci = () => {
    this.setState({ loading: true });
    NewsDataService.getNewsIdCate("691")
      .then(({ data }) => {
        this.setState({
          loading: false,
          List: data.data.sort((a, b) => a.id - b.id),
        });
      })
      .catch((error) => console.log(error));
  };

  getCateID = () => {
    this.setState({
      loadingCate: true,
    });
    NewsDataService.getInfoCate("691")
      .then(({ data }) => {
        this.setState({
          loadingCate: false,
          TitleCate: data.data[0].Title,
          ThumbnailCate: data.data[0].Thumbnail,
        });
      })
      .catch((error) => console.log(error));
  };

  render() {
    const { TitleCate, loadingCate, ThumbnailCate, List, loading } = this.state;
    return (
      <Page name="maps">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back w-48px">
              <Link className="w-48px" href="/">
                <i className="las la-home"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span
                className="title"
                onClick={() =>
                  this.$f7.views.main.router.navigate(
                    this.$f7.views.main.router.url,
                    {
                      reloadCurrent: true,
                    }
                  )
                }
              >
                {loadingCate ? "Đang tải ..." : TitleCate}
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div>
          <div>
            {loadingCate && <Skeleton height={220} />}
            {!loadingCate && (
              <img
                className="w-100"
                src={`${SERVER_APP}/upload/image/${ThumbnailCate}`}
                alt={TitleCate}
              />
            )}
          </div>
          <div className="p-15px">
            <Row>
            {!loading && List &&
                List.map((item, index) => (
                  <Col width="50" key={index}>
                    <div className="bg-white mb-15px rounded-sm" key={index}>
                      <Link
                        className="px-10px py-15px d-flex fd--c"
                        href={`/policy/${item.id}/`}
                      >
                        <div className="h-60px">
                          <img
                            className="h-100"
                            src={SERVER_APP + item.source.Thumbnail_web}
                            alt=""
                          />
                        </div>
                        <div className="fw-700 text-dark text-center mt-12px">
                          {item.text}
                        </div>
                      </Link>
                    </div>
                  </Col>
                ))}
              {loading && Array(4).fill().map((item, index) => (
                  <Col width="50" key={index}>
                    <div className="bg-white mb-15px rounded-sm" key={index}>
                      <Link
                        className="px-10px py-15px d-flex fd--c"
                      >
                        <div className="h-60px">
                          <Skeleton width={60} height={60} circle/>
                        </div>
                        <div className="fw-700 text-dark text-center mt-12px">
                          <Skeleton width={100} height={18}/>
                        </div>
                      </Link>
                    </div>
                  </Col>
                ))}
            </Row>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
