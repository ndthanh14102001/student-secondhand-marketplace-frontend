import React, { useEffect, useRef } from "react";

import PropType from "prop-types";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

import "../../assets/css/textEditor.css";
import * as constants from "./constants";
const CustomToolbar = () => (
  <div id="text-editor-toolbar">
    {/* <select className="ql-font" defaultValue="muli">
      <option value="muli">Muli</option>
    </select> */}
    <select className="ql-size" defaultValue="medium">
      <option value="extra-small">Extra Small</option>
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Larger</option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>

    <button className="ql-align" value=""></button>
    <button className="ql-align" value="center"></button>
    <button className="ql-align" value="right"></button>
    <button className="ql-align" value="justify"></button>

    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>

    <select className="ql-color" />
    {/* <button className="ql-clean" /> */}
    {/* <button className="ql-image" />
    <button className="ql-video" /> */}
  </div>
);
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "muli",
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
Quill.register(Font, true);

const TextEditor = React.forwardRef(
  (
    {
      value,
      setValue,
      placeholder,
      toolbarTextHoverColor,
      toolbarBackgroundColor,
      contentEditorBackgroundColor,
      contentEditorTextColor,
    },
    ref
  ) => {
    const r = React.useMemo(() => document.querySelector(":root"));

    const refRectQuill = useRef();

    useEffect(
      function setToolbarTextHoverColor() {
        if (toolbarTextHoverColor) {
          r.style.setProperty(
            constants.TOOLBAR_TEXT_HOVER_COLOR,
            toolbarTextHoverColor
          );
        }
      },
      [toolbarTextHoverColor]
    );

    useEffect(
      function setToolbarBackgroundColor() {
        if (toolbarBackgroundColor) {
          r.style.setProperty(
            constants.TOOLBAR_BACKGROUND_COLOR,
            toolbarBackgroundColor
          );
        }
      },
      [toolbarBackgroundColor]
    );

    useEffect(
      function setContentEditorBackgroundColor() {
        if (contentEditorBackgroundColor) {
          r.style.setProperty(
            constants.CONTENT_EDITOR_BACKGROUND_COLOR,
            contentEditorBackgroundColor
          );
        }
      },
      [contentEditorBackgroundColor]
    );

    useEffect(
      function setContentEditorTextColor() {
        if (contentEditorTextColor) {
          r.style.setProperty(
            constants.CONTENT_EDITOR_TEXT_COLOR,
            contentEditorTextColor
          );
        }
      },
      [contentEditorTextColor]
    );

    useEffect(() => {
      refRectQuill.current.getEditor().root.dataset.placeholder =
        placeholder || "";
    }, [ref, placeholder]);
    const modules = {
      toolbar: {
        container: "#text-editor-toolbar",
      },
    };
    const formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "color",
      "align",
    ];
    return (
      <div className="text-editor" ref={ref}>
        <CustomToolbar />
        <ReactQuill
          ref={refRectQuill}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          format={formats}
        />
      </div>
    );
  }
);
TextEditor.PropType = {
  value: PropType.string,
  setValue: PropType.func,
  placeholder: PropType.string,
  toolbarTextHoverColor: PropType.string,
  toolbarBackgroundColor: PropType.string,
  contentEditorBackgroundColor: PropType.string,
  contentEditorTextColor: PropType.string,
};
export default React.memo(TextEditor);
