import React, { useRef, useEffect } from "react";
import ClassicEditor from 'ckeditor5-custom-build'
import { CKEditor } from '@ckeditor/ckeditor5-react';





function Editor({ config, onEditorChange }) {
    return <CKEditor
        editor={ClassicEditor}
        config={config}
        onChange={(event, editor) => {
            if (typeof (onEditorChange) === 'function') {

                // console.log("it is functionnnnnnnnnnnnnnnnnnnnnnnn")

                onEditorChange(editor.getData())
            }
        }}
    />
}

export default Editor;
















