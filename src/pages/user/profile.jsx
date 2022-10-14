import React from "react";
import bgImage from "../../assets/images/headerbottombgapp.png";
import imgWallet from "../../assets/images/wallet.svg";
import imgLocation from "../../assets/images/location.svg";
import imgOrder from "../../assets/images/order.svg";
import imgDiary from "../../assets/images/diary.svg";
import imgCoupon from "../../assets/images/coupon.svg";
import imgEvaluate from "../../assets/images/evaluate.svg";
import { checkAvt, formatPriceVietnamese } from "../../constants/format";
import { getUser, getPassword, app_request } from "../../constants/user";
import { Page, Link, Toolbar, Row, Col, f7 } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import Skeleton from "react-loading-skeleton";
import {
  REMOVE_BADGE,
  SEND_TOKEN_FIREBASE,
  SET_BADGE,
} from "../../constants/prom21";
import { iOS } from "../../constants/helpers";
import OrderList from "./OrderList/OrderList";
import Dom7 from "dom7";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      memberInfo: {},
      isLoading: true,
      showPreloader: false,
    };
  }
  componentDidMount() {
    // const username = infoUser.MobilePhone
    //   ? infoUser.MobilePhone
    //   : infoUser.UserName;
    // const password = getPassword();
    UserService.getInfo()
      .then(({ data }) => {
        if (data.error) {
          this.$f7router.navigate("/login/");
        } else {
          this.setState({
            memberInfo: data,
            isLoading: false,
          });
        }
      })
      .catch((err) => console.log(err));

    var $ = Dom7;
    $(".page-content").css("overflow", "hidden");
  }
  signOut = () => {
    const $$this = this;
    $$this.$f7.dialog.confirm(
      "Bạn muốn đăng xuất khỏi tài khoản ?",
      async () => {
        f7.dialog.preloader(`Đăng xuất ...`);
        SEND_TOKEN_FIREBASE().then(async (response) => {
          if (!response.error && response.Token) {
            const { ID, acc_type } = getUser();
            await UserService.authRemoveFirebase({
              Token: response.Token,
              ID: ID,
              Type: acc_type,
            });
          } else {
            app_request("unsubscribe", "");
          }
          iOS() && REMOVE_BADGE();
          await localStorage.clear();
          await new Promise((resolve) => setTimeout(resolve, 800));
          f7.dialog.close();
          $$this.$f7router.navigate("/", {
            reloadCurrent: true,
          });
        });
      }
    );
  };

  checkMember = (memberInfo) => {
    if (!memberInfo) return false;
    if (memberInfo.acc_type === "M") {
      return memberInfo.acc_group > 0
        ? memberInfo.MemberGroups[0].Title
        : "Thành viên";
    }
    if (memberInfo.ID === 1) {
      return "ADMIN";
    }
    if (memberInfo.acc_type === "U" && memberInfo.GroupTitles.length > 0) {
      return memberInfo.GroupTitles.join(", ");
    }
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
    }, 600);
  }

  render() {
    const { memberInfo, isLoading } = this.state;
    return (
      <Page
        className="page-profile"
        name="profile-list"
        noNavbar
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <div className="d--f fd--c page-profile-wrap">
          <div className="page-profile__top elm-top">
            <div className="profile-bg">
              <div className="page-login__back">
                <Link onClick={() => this.$f7router.back()}>
                  <i className="las la-arrow-left"></i>
                </Link>
              </div>
              <div className="name">{memberInfo && memberInfo.FullName}</div>
              <div className="profile-bg__qrcode">
                <Link href="/barcode/">
                  <i className="las la-qrcode"></i>
                </Link>
              </div>
              <div className="profile-bg__logout">
                <Link onClick={() => this.signOut()}>
                  <i className="las la-sign-out-alt"></i>
                </Link>
              </div>
            </div>
            <div className="profile-info">
              <img src={bgImage} />
              <div className="profile-info__avatar">
                {isLoading ? (
                  <Skeleton circle={true} height={90} width={90} />
                ) : (
                  <img src={checkAvt(memberInfo && memberInfo.Photo)} />
                )}

                <Link noLinkClass href="/detail-profile/">
                  <i className="las la-pen"></i>
                </Link>
              </div>
              {isLoading ? (
                <div className="profile-info__basic">
                  <div className="name">
                    <Skeleton width={100} count={1} />
                  </div>
                  <div className="group">
                    <Skeleton width={120} count={1} />
                  </div>
                </div>
              ) : (
                <div className="profile-info__basic">
                  <div className="name">
                    {memberInfo && memberInfo.FullName}
                  </div>
                  <div className="group">
                    {this.checkMember(memberInfo && memberInfo)}
                  </div>
                </div>
              )}

              <div className="profile-wallet px-15px border-top">
                <Row>
                  <Col width="50 border-right">
                    <div
                      className="profile-wallet-item"
                      onClick={() =>
                        this.$f7.views.main.router.navigate(`/wallet/?type=VI`)
                      }
                    >
                      <div className="profile-wallet__price font-number">
                        {formatPriceVietnamese(memberInfo?.Present?.nap_vi)}
                      </div>
                      <div className="profile-wallet__title">Ví khả dụng</div>
                    </div>
                  </Col>
                  <Col width="50">
                    <div
                      className="profile-wallet-item"
                      onClick={() =>
                        this.$f7.views.main.router.navigate(
                          `/wallet/?type=THE_TIEN`
                        )
                      }
                    >
                      <div className="profile-wallet__price font-number">
                        {formatPriceVietnamese(
                          memberInfo?.Present?.the_tien_kha_dung
                        )}
                      </div>
                      <div className="profile-wallet__title">Thẻ tiền</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="bg-white mt-4px">
              <div className="order-title text-uppercase fw-600">
                Đơn hàng của bạn
              </div>
            </div>
          </div>
          <div className="page-profile__order elm-order">
            <OrderList />
          </div>
        </div>
        {/* <div className="profile-function">
          <Row>
            <Col width="33">
              <Link noLinkClass href="/wallet/">
                <div className="image">
                  <img src={imgWallet} />
                </div>
                <span>Ví & Thẻ tiền</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/diary/">
                <div className="image">
                  <img src={imgDiary} />
                </div>
                <span>Nhật ký</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/order/">
                <div className="image">
                  <img src={imgOrder} />
                </div>
                <span>Đơn hàng</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/voucher/">
                <div className="image">
                  <img src={imgCoupon} />
                </div>
                <span>Mã giảm giá</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/rating/">
                <div className="image">
                  <img src={imgEvaluate} />
                </div>
                <span>Đánh giá</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/maps/">
                <div className="image">
                  <img src={imgLocation} />
                </div>
                <span>Liên hệ</span>
              </Link>
            </Col>
          </Row>
        </div> */}
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
