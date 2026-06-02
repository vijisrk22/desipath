import zipfile
import xml.etree.ElementTree as ET
import sys
import re

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as docx:
            xml_content = docx.read('word/document.xml')
            
            # Simple regex to remove xml tags
            text = re.sub(rb'<[^>]+>', b' ', xml_content)
            text = re.sub(rb'\s+', b' ', text)
            print(text.decode('utf-8'))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_text_from_docx(sys.argv[1])
