import React, { Component } from 'react'
import ClassicEditor from 'ckeditor5-custom-build'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from "../../../common/Editor"
export class Test extends Component {
    render() {
        return (
            <div>

                <Editor onEditorChange={(e) => {
                    // console.log(`e`, e)
                }}
                    config={{
                        placeholder: "Please enter description",
                        simpleUpload: {
                            // The URL that the images are uploaded to.
                            uploadUrl: 'http://www.example.com',

                            // Enable the XMLHttpRequest.withCredentials property.
                            // withCredentials: true,

                            // Headers sent along with the XMLHttpRequest to the upload server.
                            headers: {
                                'X-CSRF-TOKEN': 'CSRF-Token',
                                Authorization: 'Bearer <JSON Web Token>'
                            }
                        }
                    }} />
                {/* <CKEditor
                    editor={ClassicEditor}
                    config={{
                        placeholder: "Please enter description",
                        simpleUpload: {
                            // The URL that the images are uploaded to.
                            uploadUrl: 'http://www.example.com',

                            // Enable the XMLHttpRequest.withCredentials property.
                            // withCredentials: true,

                            // Headers sent along with the XMLHttpRequest to the upload server.
                            headers: {
                                'X-CSRF-TOKEN': 'CSRF-Token',
                                Authorization: 'Bearer <JSON Web Token>'
                            }
                        }
                    }}
                //   data={description ?? ""}
                //onReady={editor => {
                // You can store the "editor" and use when it is needed.
                //console.log('Editor is ready to use!', editor);
                //}}
                // onChange={(event, editor) => {
                //     onChange(editor.getData())

                // }}
                /> */}

            </div>
        )
    }
}

export default Test