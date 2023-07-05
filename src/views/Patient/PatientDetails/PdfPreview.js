import React, { Component } from 'react'
import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

export class PdfPreview extends Component {
    constructor(props) {
        super(props);
        this.intialState = {
            url: ""
        }
        this.state = this.intialState
    }
    componentDidMount() {
        let url = this.props.location.state?.url
        // console.log(url)
    }
    render() {
        const { url } = this.state
        return (
            <div className="mt4" style={{ height: '750px' }}>
                {url ? (
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            height: '100%',
                        }}
                    >
                        {/* <Viewer fileUrl={url} /> */}
                    </div>
                ) : (
                    <div
                        style={{
                            alignItems: 'center',
                            border: '2px dashed rgba(0, 0, 0, .3)',
                            display: 'flex',
                            fontSize: '2rem',
                            height: '100%',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        Preview area
                    </div>
                )}
            </div>
        )
    }
}

export default PdfPreview