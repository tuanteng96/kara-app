import React from 'react'
import bgImage from '../../assets/images/headerbottombgapp.png'
import { checkAvt } from '../../constants/format'
import { getUser, getPassword } from '../../constants/user'
import { Page, Link } from 'framework7-react'
import UserService from '../../service/user.service'
import Barcode from 'react-barcode'
export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      memberInfo: [],
      code: 'code',
      open: true,
      widthLine: 0,
      MemberID: '',
    }
  }

  componentDidMount() {
    const infoUser = getUser()
    const password = getPassword()
    if (!infoUser) return false
    const username = infoUser?.MobilePhone
    this.setState({
      MemberID: infoUser.ID,
    })

    UserService.getInfo(username, password)
      .then((response) => {
        const memberInfo = response.data
        this.setState({
          memberInfo: memberInfo,
        })
      })
      .catch((err) => console.log(err))
    this.getBarCode(infoUser.ID)
    this.barCodePlay()
  }
  barCodePlay() {
    this.playBarCode = setInterval(this.setBarCode, 2 * 60 * 100)
  }
  setBarCode = () => {
    const MemberID = this.state.MemberID
    var $$ = this.Dom7
    var $this = this
    var $widthRs = this.state.widthLine
    $$('.line-qr').css('width', $widthRs + '%')
    if ($widthRs === 100) {
      clearInterval(this.playBarCode)
      $this.$f7.dialog.confirm(
        'Mã Check In đã hết bạn. Bạn có muốn làm mới không ?',
        () => {
          this.getBarCode(MemberID)
          $this.barCodePlay()
          this.setState({
            widthLine: 0,
          })
        },
      )
    }
    this.setState({
      widthLine: $widthRs + 1,
    })
  }

  onPageBeforeOut() {
    clearInterval(clearInterval(this.playBarCode))
  }

  getBarCode = (memberID) => {
    UserService.getBarCode(memberID)
      .then((response) => {
        const code = response.data.code
        this.setState({
          code: code,
        })
      })
      .catch((err) => console.log(err))
  }

  checkMember = (memberInfo) => {
    if (!memberInfo) return false
    if (memberInfo.acc_type === 'M') {
      return memberInfo.acc_group > 0
        ? memberInfo.MemberGroups[0].Title
        : 'Thành viên'
    }
    if (memberInfo.ID === 1) {
      return 'ADMIN'
    }
    if (memberInfo.acc_type === 'U' && memberInfo.GroupTitles.length > 0) {
      return memberInfo.GroupTitles.join(', ')
    }
  }

  render() {
    const member = this.state.memberInfo && this.state.memberInfo
    const code = this.state.code
    return (
      <Page
        onPageBeforeOut={this.onPageBeforeOut.bind(this)}
        name="barcode"
        noNavbar
        noToolbar
      >
        <div className="profile-bg">
          <div className="page-login__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className="name">Check In</div>
          <img src={bgImage} />
        </div>
        <div className="profile-info">
          <div className="profile-info__avatar">
            <img src={checkAvt(member.Photo)} />
          </div>
          <div className="profile-info__basic">
            <div className="name">{member.FullName}</div>
            <div className="group">
                {this.checkMember(member && member)}
            </div>
          </div>
        </div>
        <div className="barcode-qr">
          <div className="barcode-qr__box">
            <div className="barcode-qr__box-text">
              {/* <i className="las la-camera"></i> */}
              <span>Vui lòng quét mã vạch của bạn</span>
            </div>
            <Barcode value={code && code} />
            <div className="line-qr"></div>
          </div>
        </div>
      </Page>
    )
  }
}
