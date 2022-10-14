import { Button, Link, PageContent, Sheet } from 'framework7-react'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import PageNoData from '../../../components/PageNoData'
import { checkImageProduct, formatPriceVietnamese } from '../../../constants/format'
import UserService from '../../../service/user.service'
import ReactHtmlParser from "react-html-parser";

function OrderList(props) {
  const [loading, setLoading] = useState(false)
  const [ListOrder, setListOrder] = useState([])
  const [loadingPay, setLoadingPay] = useState(false)
  const [ValuePay, setValuePay] = useState('')

  useEffect(() => {
    getOrderAll()
    getInfoPay()
  }, [])

  const getInfoPay = () => {
    setLoadingPay(true)
    UserService.getConfig('App.thanhtoan')
      .then(({ data }) => {
        setValuePay(data.data && data.data[0]?.ValueLines)
        setLoadingPay(false)
      })
      .catch((error) => console.log(error))
  }

  const getOrderAll = () => {
    setLoading(true)
    UserService
      .getOrderAll2()
      .then(({ data }) => {
        setListOrder(data)
        setLoading(false)
      })
      .catch((er) => console.log(er))
  }

  const checkStatus = (item) => {
    if (item.Status === 'finish') {
      return 'success'
    }
    if (item.Status === 'cancel' && item.IsReturn !== 0) {
      return 'primary'
    }
    if (item.Status === 'cancel') {
      return 'danger'
    }
    return 'warning'
  }

  return (
    <div className="page-order">
      <div className="page-order__list p-0">
        {loading &&
          Array(1)
            .fill()
            .map((item, index) => (
              <Link key={index} noLinkClass className="item mb-0 mt-2px">
                <div className="item-header">
                  <i className="las la-dolly"></i>
                  <div className="text">
                    <div className="date">
                      <Skeleton width={60} />
                    </div>
                    <div className={`status`}>
                      <Skeleton width={60} />
                    </div>
                  </div>
                </div>
                <div className="item-body">
                  <div className="list-sub">
                    {Array(index + 2)
                      .fill()
                      .map((sub, idx) => (
                        <div className="list-sub-item" key={idx}>
                          <div className="img">
                            <Skeleton width={60} height={60} />
                          </div>
                          <div className="text">
                            <Skeleton count={2} />
                            <div className="text-count">
                              <Skeleton width={70} />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="item-footer">
                  <div className="content-item">
                    <span>Tổng đơn hàng :</span>
                    <span className="price text-red">
                      <Skeleton width={60} />
                    </span>
                  </div>
                  <div className="content-item">
                    <span>Đã thanh toán :</span>
                    <span className="price">
                      <Skeleton width={60} />
                    </span>
                    <span className="px">,</span>
                    <span>Còn nợ :</span>
                    <span className="price">
                      <Skeleton width={60} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        {!loading && (
          <>
            {ListOrder && ListOrder.length > 0 ? (
              ListOrder.map((item, index) => (
                <Link key={index} noLinkClass className="item mb-0 mt-2px">
                  <div className="item-header px-15px">
                    <i className="las la-dolly"></i>
                    <div className="text">
                      <div className="date font-number">
                        {moment(item.OrderDate).format("HH:mm DD-MM-YYYY")}
                      </div>
                      <div className={`status ` + checkStatus(item)}>
                        {item.IsReturn !== 0 && item.Status === "cancel"
                          ? "Trả lại"
                          : item.StatusText}
                      </div>
                    </div>
                  </div>
                  <div className="item-body px-15px py-15px">
                    <div className="list-sub">
                      {item.Items &&
                        item.Items.map((sub, idx) => (
                          <div className="list-sub-item" key={idx}>
                            <div className="img">
                              <img src={checkImageProduct(sub.ProdThumb)} />
                            </div>
                            <div className="text">
                              <div className="text-name">{sub.ProdTitle}</div>
                              <div className="text-count">
                                SL <b className="font-number">x{sub.Qty}</b>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="item-footer p-15px">
                    <div className="content-item">
                      <span>Tổng đơn hàng :</span>
                      <span className="price text-red font-number">
                        {formatPriceVietnamese(item.ToPay)}
                        <b>₫</b>
                      </span>
                    </div>
                    {item.Status !== "cancel" && (
                      <div className="content-item">
                        {/* <span>Đã thanh toán :</span>
                                <span className="price">
                                  {formatPriceVietnamese(item.Payed)}
                                  <b>₫</b>
                                </span> */}
                        {item.Status === "finish" && (
                          <React.Fragment>
                            {item.thanhtoan.thanh_toan_tien > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Thanh toán thực tế :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(item.thanhtoan.thanh_toan_tien)
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {item.thanhtoan.thanh_toan_vi > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Thanh toán ví :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(item.thanhtoan.thanh_toan_vi)
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {item.thanhtoan.hoan_vi_tra_hang > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Hoàn ví khi trả hàng :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(item.thanhtoan.hoan_vi_tra_hang)
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {item.thanhtoan.hoan_vi_ket_thuc_the > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Hoàn ví khi kết thúc thẻ :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(
                                      item.thanhtoan.hoan_vi_ket_thuc_the
                                    )
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {item.thanhtoan.ket_thuc_the_hoan_tien > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Kết thúc thẻ hoàn tiền :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(
                                      item.thanhtoan.ket_thuc_the_hoan_tien
                                    )
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {item.thanhtoan.ket_thuc_the_hoan_vi > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Kết thúc thẻ hoàn ví :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(
                                      item.thanhtoan.ket_thuc_the_hoan_vi
                                    )
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {/* {item.thanhtoan.thanh_toan_ao > 0 && (
                                      <React.Fragment>
                                        <span className="px">,</span>
                                        <span>Thanh toán ảo :</span>
                                        <span className="price">
                                          {formatPriceVietnamese(
                                            Math.abs(item.thanhtoan.thanh_toan_ao)
                                          )}
                                          <b>₫</b>
                                        </span>
                                      </React.Fragment>
                                    )} */}
                            {item.thanhtoan.tra_hang_hoan_tien > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Trả hàng hoàn tiền :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(item.thanhtoan.tra_hang_hoan_tien)
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            {item.thanhtoan.tra_hang_hoan_vi > 0 && (
                              <React.Fragment>
                                <span className="px">,</span>
                                <span>Trả hàng ví :</span>
                                <span className="price font-number">
                                  {formatPriceVietnamese(
                                    Math.abs(item.thanhtoan.tra_hang_hoan_vi)
                                  )}
                                  <b>₫</b>
                                </span>
                              </React.Fragment>
                            )}
                            <span className="px">,</span>
                          </React.Fragment>
                        )}
                        <span>Còn nợ :</span>
                        <span className="price font-number">
                          {formatPriceVietnamese(
                            Math.abs(
                              item.thanhtoan.tong_gia_tri_dh -
                                item.thanhtoan.thanh_toan_tien -
                                item.thanhtoan.thanh_toan_vi -
                                item.thanhtoan.thanh_toan_ao
                            )
                          )}
                          <b>₫</b>
                        </span>
                        <div className="btn-div">
                          {Math.abs(
                            item.thanhtoan.tong_gia_tri_dh -
                              item.thanhtoan.thanh_toan_tien -
                              item.thanhtoan.thanh_toan_vi -
                              item.thanhtoan.thanh_toan_ao
                          ) > 0 && (
                            <Button
                              sheetOpen={`.demo-sheet-${item.ID}`}
                              className="show-more"
                            >
                              Thanh toán
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <Sheet
                      className={`demo-sheet-${item.ID} sheet-detail sheet-detail-order`}
                      style={{
                        height: "auto !important",
                        "--f7-sheet-bg-color": "#fff",
                      }}
                      swipeToClose
                      backdrop
                    >
                      <Button
                        sheetClose={`.demo-sheet-${item.ID}`}
                        className="show-more"
                      >
                        <i className="las la-times"></i>
                      </Button>
                      <PageContent>
                        <div className="page-shop__service-detail">
                          <div className="title">
                            <h4>Thanh toán đơn hàng #{item.ID}</h4>
                          </div>
                          <div className="content">
                            {loadingPay && <Skeleton count={6} />}
                            {!loadingPay &&
                              ValuePay &&
                              ReactHtmlParser(
                                ValuePay.replaceAll("ID_ĐH", `#${item.ID}`)
                                  .replaceAll(
                                    "MONEY",
                                    `${formatPriceVietnamese(
                                      Math.abs(item.RemainPay)
                                    )} ₫`
                                  )
                                  .replaceAll("ID_DH", `${item.ID}`)
                              )}
                          </div>
                        </div>
                      </PageContent>
                    </Sheet>
                  </div>
                </Link>
              ))
            ) : (
              <PageNoData text="Đơn hàng của bạn trống. Vui lòng đặt hàng." />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderList
