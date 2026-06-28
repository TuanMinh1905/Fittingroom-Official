import docx
import sys

def extract_text(filename, out_filename):
    try:
        doc = docx.Document(filename)
        with open(out_filename, 'w', encoding='utf-8') as f:
            for p in doc.paragraphs:
                f.write(p.text + '\n')
    except Exception as e:
        print(f"Error reading {filename}: {e}")

extract_text('draf.docx', 'draf_text.txt')
extract_text('Mau-5-TrinhBay-KLTN.docx', 'mau5_text.txt')
print("Extraction complete")
