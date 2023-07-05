import * as React from "react"
import { Dialog } from "@reach/dialog"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Table,
  Input,
  Row,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge, Form
} from "reactstrap";
export default class ConfirmStatusChange extends React.Component {
  state = {
    open: false,
    callback: null
  }

  show = callback => event => {
    event.preventDefault()

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    }

    this.setState({
      open: true,
      callback: () => callback(event)
    })
  }

  hide = () => this.setState({ open: false, callback: null })

  confirm = () => {
    this.state.callback()
    this.hide()
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children(this.show)}

        {this.state.open && (
          <Dialog modal={true} style={{ "width": "55vh", "padding":"1.5rem"}}>
            <h3 style={{ width: "100%"}} className="modal-title" >{this.props.title}</h3>
            <hr />
            <p style={{ "fontSize": "15px" }}>{this.props.description}</p>
           
            <div className="text-right">
            <button className="btn btn-primary m-1" onClick={this.confirm}>OK</button>{" "}
            <button className="btn btn-secondary m-1" onClick={this.hide}>Cancel</button>
              
            </div>
          </Dialog>
        )}
      </React.Fragment>
    )
  }
}
