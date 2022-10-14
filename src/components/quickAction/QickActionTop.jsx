import { Link } from "framework7-react";
import React from "react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { CALL_PHONE, OPEN_LINK } from "../../constants/prom21";
import userService from "../../service/user.service";
import { iOS } from "./../../constants/helpers";

export default class QickActionTop extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.getPhone();
  }
  getPhone = () => {
    userService
      .getConfig("Chung.sdt,chung.link.fanpage")
      .then((response) => {
        this.setState({
          phone: response.data.data[1].ValueText,
          mess: `https://m.me/${response.data.data[0].ValueText}`,
        });
      })
      .catch((err) => console.log(err));
  };

  handleCall = (phone) => {
    CALL_PHONE(phone);
  };
  handleLink = (link) => {
    OPEN_LINK(link);
  };

  render() {
    const { mess, phone } = this.state;
    return (
      <>
        {phone && (
          <div className="call" onClick={() => this.handleCall(phone && phone)}>
            <i className="fas fa-phone-alt text-white"></i>
          </div>
        )}
        {mess && (
          <>
            {iOS() ? (
              <Link external href={mess} noLinkClass className="item mess">
                <i className="fab fa-facebook-messenger text-white"></i>
              </Link>
            ) : (
              <div className="mess" onClick={() => this.handleLink(mess)}>
                <i className="fab fa-facebook-messenger text-white"></i>
              </div>
            )}
          </>
        )}
      </>
    );
  }
}
