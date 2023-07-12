import * as React from "react"
import { Button, Modal, Input, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";

export default class ConfirmWithInput extends React.Component {

  //nameChange = (e) => {
  //  this.setState({ name: e.target.value });
  //}
  constructor(props) {
    super(props);

    this.initialState = {
      name: "",
      error:""
    };
    this.state = this.initialState;

  }
  nameChange(date) {
    this.setState({ name: date, error:""});
  }

  reg = () => {
    if (this.state.name != null && this.state.name != "") {
      this.props.onRegister(this.state.name);
    } else {
      this.setState({ error: "Please select date." });
    }
  }


  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalHeader>{this.props.modalTitle}</ModalHeader>
        <ModalBody>
          {this.props.modalBody}:
          <div className="cus-date-picker">
            <DatePicker
              selected={this.state.name}
              onChange={this.nameChange.bind(this)}
              dateFormat="MM/dd/yyyy"
              placeholderText="mm/dd/yyyy"
              showMonthDropdown
              showYearDropdown
              className={this.state.name != null && this.state.name != "" ? "is-valid" : "is-invalid"}
              dropdownMode="select"
              fixedHeight
            />
          </div>
          {<span className='error'>{this.state.error}</span>}
          {/*<Input onChange={this.nameChange} />*/}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.reg}>Submit</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
