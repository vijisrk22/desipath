import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Controller } from "react-hook-form";

function RichTextInput({ name, control, text, placeholder }) {
  return (
    <div className="py-2">
      <div className="text-[#374151] text-sm font-semibold font-dmsans mb-1.5 ml-1">
        {text || "Description"}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="rich-text-editor-container">
            <ReactQuill
              theme="snow"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder={placeholder || "Enter details..."}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link'],
                  ['clean']
                ],
              }}
            />
          </div>
        )}
      />
      <style>{`
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          background-color: #f9fafb;
          min-height: 150px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background-color: #f9fafb;
          border-bottom: none;
        }
        .rich-text-editor-container .ql-editor {
          min-height: 150px;
        }
        .rich-text-editor-container .ql-container.ql-snow {
          border: 1.5px solid #e5e7eb;
        }
        .rich-text-editor-container .ql-toolbar.ql-snow {
          border: 1.5px solid #e5e7eb;
        }
        .rich-text-editor-container:hover .ql-container.ql-snow,
        .rich-text-editor-container:hover .ql-toolbar.ql-snow {
          border-color: #ffa41c;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}

export default RichTextInput;
