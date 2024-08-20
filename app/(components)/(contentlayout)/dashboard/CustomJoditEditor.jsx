import React from 'react';
import dynamic from 'next/dynamic';
// import JoditEditor from 'jodit-react';
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});


const configJot = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'paragraph', // Make sure this is included
      'outdent',
      'indent',
      '|',
      'link',
      '|',
      'undo',
      'redo',
      '|',
      'source'
    ],
    buttonsXS: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'paragraph',
      'undo',
      'redo',
      'source'
    ],
    removeButtons: [
      'fullsize',
      'about',
      'video',
      'print',
      'table',
      'superscript',
      'subscript',
      'file',
    ],
    useAceEditor: false,
    controls: {
      paragraph: {
        list: {
          'p': 'Normal',
          'h1': 'Heading 1',
          'h2': 'Heading 2',
          'h3': 'Heading 3',
          'h4': 'Heading 4',
          'code': 'Code'
        }
      }
    },
    disablePlugins: 'add-new-line',
    events: {

      click: function(e) {
        console.log('Clicked element:', e.target);
      },
      change: function() {
        console.log('Content changed');
      }
    }
  };
  

  

  const CustomJoditEditor = ({ value, onChange, setContent }) => {
    
    return (
      <div className="jodit-wrapper">
        <JoditEditor
          value={value}
          config={configJot}
          onBlur={onChange}
        setContent={setContent}
          onChange={(newContent) => {}}
        />
        <style jsx global >
        {`
          .jodit-wrapper .jodit-wysiwyg {
            background-color: #e2e2e2 !important;
            color: #111c43 !important;
          }
          .jodit-wrapper .jodit-wysiwyg ul {
            list-style-type: disc !important;
            margin-left: 20px !important;
          }
          .jodit-wrapper .jodit-wysiwyg ol {
            list-style-type: decimal !important;
            margin-left: 20px !important;
          }
          .jodit-wrapper .jodit-wysiwyg ul li,
          .jodit-wrapper .jodit-wysiwyg ol li {
            display: list-item !important;
          }
          .jodit-wrapper .jodit-wysiwyg h1 { font-size: 24px; font-weight: bold; }
          .jodit-wrapper .jodit-wysiwyg h2 { font-size: 20px; font-weight: bold; }
          .jodit-wrapper .jodit-wysiwyg h3 { font-size: 16px; font-weight: bold; }
          .jodit-wrapper .jodit-wysiwyg h4 { font-size: 14px; font-weight: bold; }
          .jodit-wrapper .jodit-wysiwyg code { background-color: #555; padding: 2px 4px; border-radius: 3px; }
  
          .jodit-wrapper .jodit-wysiwyg p:empty:before {
            content: attr(data-jodit-placeholder);
            color: #e2e2e2;
          }

          .jodit-wrapper .jodit-wysiwyg p {
            margin-top: 10px;
            margin-bottom: 5px;
        }

        `}
        
        </style>
      </div>
    );
  };

  export default CustomJoditEditor;

