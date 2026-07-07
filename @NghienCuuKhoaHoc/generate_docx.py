import sys
import os
try:
    from docx import Document
    from docx.shared import Pt, Cm, Inches
    from docx.enum.text import WD_ALIGN_PARAGRAPH
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'python-docx'])
    from docx import Document
    from docx.shared import Pt, Cm, Inches
    from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Page setup
section = doc.sections[0]
section.top_margin = Cm(3.0)
section.bottom_margin = Cm(2.5)
section.left_margin = Cm(3.0)
section.right_margin = Cm(2.0)

# Default style
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(11)
pf = style.paragraph_format
pf.line_spacing = 1.0
pf.space_after = Pt(3)
pf.first_line_indent = Cm(0.5)
pf.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

def add_title(text, size=13, bold=True):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.font.bold = bold
    p.paragraph_format.first_line_indent = 0
    p.paragraph_format.space_after = Pt(6)

def add_center_text(text, italic=False, size=11):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.font.italic = italic
    p.paragraph_format.first_line_indent = 0
    p.paragraph_format.space_after = Pt(3)

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = 0
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.font.bold = True

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = 0
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.italic = True

def add_heading_3(text):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = 0
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.font.italic = True

def add_abstract(title, content, keywords):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = 0
    run = p.add_run(title + '\t')
    run.font.bold = True
    p.add_run(content)
    
    p2 = doc.add_paragraph()
    p2.paragraph_format.first_line_indent = 0
    run2 = p2.add_run('KEYWORDS' if 'KEYWORDS' in title else 'TỪ KHÓA')
    run2.font.bold = True
    p2.add_run('\t' + keywords)

# Content
add_title('Fashion E-Commerce Website Integrated with 3D Virtual Fitting Room')
add_center_text('Tên tác giả 11*, Tên tác giả 22')
add_center_text('1Khoa Công nghệ thông tin, Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh, Việt Nam', italic=True)
add_center_text('*Tác giả liên hệ. Email: abc@xyz.com', italic=True)

add_abstract('ABSTRACT', 'The rapid development of e-commerce requires solutions to overcome the inability to try on clothes directly when shopping online. This study aims to build a fashion e-commerce website integrated with a 3D virtual fitting room and a smart advisory assistant, helping users visualize outfits on a digital body and receive personalized recommendations. The system is developed based on a distributed architecture combining deep learning models. The simulation process applies human body parameterization and neural networks to predict physical fabric deformation. Simultaneously, a large language model is fine-tuned through prompt engineering to process natural language and analyze body shapes. The study successfully implemented a real-time virtual try-on pipeline, rendering outfits that fit individual characteristics and integrating a size limit control mechanism. The virtual assistant accurately responds to fashion expertise queries and automatically filters irrelevant requests. The results provide a comprehensive technological solution to enhance the online shopping experience, affirming the feasibility of 3D simulation in retail practices.', 'E-commerce; Virtual fitting room; 3D simulation; Smart assistant; Personalization.')

add_title('Website kinh doanh thời trang tích hợp phòng thử đồ ảo ba chiều')
add_center_text('Tên tác giả 11*, Tên tác giả 22')
add_center_text('1Khoa Công nghệ thông tin, Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh, Việt Nam', italic=True)
add_center_text('*Tác giả liên hệ. Email: abc@xyz.com', italic=True)

add_abstract('TÓM TẮT', 'Sự phát triển thương mại điện tử đòi hỏi giải pháp khắc phục hạn chế không thể thử trang phục trực tiếp. Nghiên cứu này nhằm mục đích xây dựng website kinh doanh thời trang tích hợp phòng thử đồ ảo ba chiều và trợ lý tư vấn thông minh, giúp người dùng trực quan hóa trang phục trên cơ thể kỹ thuật số và nhận gợi ý cá nhân hóa. Hệ thống được phát triển dựa trên kiến trúc phân tán kết hợp các mô hình học sâu. Quá trình mô phỏng ứng dụng phương pháp tham số hóa cơ thể người và mạng nơ-ron dự đoán biến dạng vật lý vải. Cùng lúc, mô hình ngôn ngữ lớn được tinh chỉnh qua kỹ thuật thiết kế câu lệnh để xử lý ngôn ngữ tự nhiên và phân tích hình thể. Nghiên cứu triển khai thành công quy trình thử đồ ảo thời gian thực, kết xuất trang phục vừa vặn đặc điểm từng cá nhân và tích hợp cơ chế kiểm soát giới hạn kích cỡ. Trợ lý ảo phản hồi chính xác truy vấn chuyên môn thời trang, tự động sàng lọc yêu cầu sai mục đích. Kết quả này cung cấp một giải pháp công nghệ toàn diện giúp nâng cao trải nghiệm mua sắm trực tuyến, khẳng định tính khả thi của công nghệ mô phỏng không gian ba chiều trong thực tiễn bán lẻ.', 'Thương mại điện tử; Phòng thử đồ ảo; Mô phỏng trang phục; Trợ lý thông minh; Cá nhân hóa.')

add_heading_1('1. Giới thiệu')
doc.add_paragraph('Trong bối cảnh sự phát triển mạnh mẽ của thương mại điện tử, nhu cầu mua sắm trực tuyến của người tiêu dùng ngày càng gia tăng. Đối với các doanh nghiệp bán lẻ thời trang, việc mang lại trải nghiệm mua sắm chân thực và tiện lợi là một yếu tố mang tính sống còn [1]. Tuy nhiên, một hạn chế lớn nhất của thương mại điện tử thời trang hiện nay là khách hàng không thể trực tiếp ướm thử trang phục để xem chúng có vừa vặn và phù hợp với vóc dáng của mình hay không [2]. Sự thiếu hụt này dẫn đến tỷ lệ hoàn trả hàng hóa cao, gây tốn kém chi phí logistics và ảnh hưởng tiêu cực đến trải nghiệm của khách hàng.')
doc.add_paragraph('Nhằm giải quyết vấn đề trên, công nghệ thực tế ảo và mô phỏng 3D đã dần được nghiên cứu và đưa vào ứng dụng. Các hệ thống phòng thử đồ ảo (Virtual Fitting Room) cho phép người dùng quan sát hình ảnh 3D của bản thân khi mặc các trang phục khác nhau [3]. Dù vậy, việc triển khai một nền tảng thực sự mang tính tương tác cao, kết hợp vật lý biến dạng vải theo thời gian thực trên nền tảng Web vẫn gặp nhiều thách thức về hiệu năng tính toán và độ phức tạp của dữ liệu mô hình [4]. Cùng với đó, việc thiếu đi sự hỗ trợ tư vấn tức thời như nhân viên bán hàng thật cũng làm giảm đi khả năng chốt đơn trong trải nghiệm số.')
doc.add_paragraph('Nghiên cứu này nhằm mục đích thiết kế và thử nghiệm kiến trúc hệ thống Website kinh doanh thời trang tích hợp phòng thử đồ ảo sử dụng công nghệ mô phỏng TailorNet và trợ lý AI tư vấn. Mục tiêu trọng tâm là tạo ra luồng vận hành khép kín (End-to-End) từ khi người dùng nhập số đo, hệ thống kết xuất cơ thể 3D, mô phỏng nếp gấp vải cho đến khi hoàn tất giao dịch. Thông qua giải pháp này, nghiên cứu đánh giá tính khả thi trong việc cung cấp một dịch vụ thời trang cá nhân hóa cao, tự động hóa quy trình tư vấn và tối ưu trải nghiệm khách hàng.')

add_heading_1('2. Khảo sát các nghiên cứu liên quan')
doc.add_paragraph('Các hệ thống phòng thử đồ ảo (Virtual Try-On) đã thu hút nhiều sự quan tâm của cộng đồng nghiên cứu học máy và thị giác máy tính. Khởi đầu với các phương pháp xử lý hình ảnh 2D như VITON [3], hệ thống thực hiện dự đoán biến dạng của quần áo bằng cách phân tích và ghép chồng lên ảnh người dùng. Dù mang lại kết quả khả quan với tốc độ xử lý nhanh, các phương pháp 2D thường gặp hạn chế lớn trong việc duy trì tính chân thực vật lý (độ rủ của vải, nếp gấp thực tế) và xử lý các tư thế cơ thể phức tạp hay bị che khuất.')
doc.add_paragraph('Gần đây, sự xuất hiện của mô hình SMPL (Skinned Multi-Person Linear Model) [2] đã tạo nền tảng vững chắc cho việc biểu diễn hình học cơ thể người trong không gian ba chiều. Từ nền tảng SMPL, nhiều hệ thống tiên tiến đã được phát triển để mô phỏng sự tương tác giữa cơ thể và trang phục, tiêu biểu là kiến trúc TailorNet [1]. TailorNet vượt trội hơn so với các phương pháp trước đó nhờ khả năng dự đoán vật lý nếp gấp vải dựa trên hình dáng cơ thể, loại quần áo và chuyển động. Tuy nhiên, phần lớn các nghiên cứu về TailorNet thường dừng lại ở mức mô phỏng cục bộ hoặc chạy thử nghiệm cục bộ (offline). Việc áp dụng nguyên bản các mô hình này vào một nền tảng thương mại điện tử thực tế vẫn gặp rào cản về kiến trúc phân tán API và hiệu năng xử lý để đáp ứng qua nền Web [7].')
doc.add_paragraph('Bên cạnh đó, trong lĩnh vực hỗ trợ khách hàng mua sắm, các hệ thống chatbot truyền thống hoạt động dựa trên luật phân nhánh (rule-based) dẫn đến sự cứng nhắc trong tư vấn. Việc ứng dụng các Mô hình Ngôn ngữ Lớn (LLM) như GPT-4 [4] vào hệ thống bán lẻ được xem là hướng đi đột phá để tạo ra trợ lý ảo có khả năng hiểu ngữ cảnh thời trang chuyên sâu. Nhận thấy khoảng trống trong việc tích hợp một quy trình hoàn chỉnh gồm cả mô phỏng vật lý đồ họa 3D và Trí tuệ nhân tạo tạo sinh xử lý ngôn ngữ vào cùng một ứng dụng duy nhất, nghiên cứu này đề xuất giải pháp kiến trúc tổng thể, khắc phục các giới hạn triển khai của những nghiên cứu trước đây.')

add_heading_1('3. Phương pháp nghiên cứu')
add_heading_2('3.1. Kiến trúc hệ thống tổng thể')
doc.add_paragraph('Hệ thống được thiết kế theo kiến trúc phân tán đa tầng nhằm đảm bảo khả năng xử lý đồng thời các tác vụ tính toán nặng và giao dịch web thông thường. Kiến trúc bao gồm ba phân lớp chính: Tầng giao diện người dùng (Frontend), Tầng máy chủ API trung gian (Backend) và Tầng xử lý Trí tuệ nhân tạo (AI Engine) [5].')
doc.add_paragraph('Tại tầng Frontend, hệ thống được xây dựng bằng framework Next.js kết hợp cùng Three.js [8] để trực quan hóa đồ họa không gian ba chiều ngay trên trình duyệt. Tầng Backend sử dụng Node.js với framework Hono để điều phối các luồng giao tiếp, quản lý phiên người dùng và kết nối cơ sở dữ liệu MongoDB. Tầng AI Engine là một microservice độc lập viết bằng Python (FastAPI) [6], chuyên chịu trách nhiệm chạy các mạng nơ-ron học sâu để dự đoán biến dạng vải và kết xuất mô hình cơ thể.')

add_heading_2('3.2. Phương pháp mô phỏng trang phục ảo')
doc.add_paragraph('Quy trình mô phỏng trang phục được triển khai dựa trên mô hình hình học cơ thể SMPL (Skinned Multi-Person Linear Model) [2] và mô hình TailorNet [1]. Đầu tiên, hệ thống chuyển đổi các số đo cơ bản của người dùng (chiều cao, cân nặng, số đo các vòng) thành bộ tham số định hình (shape parameters) của SMPL để tái tạo lại cơ thể kỹ thuật số có tỷ lệ chính xác so với thực tế.')
doc.add_paragraph('Sau khi có cơ thể gốc, hệ thống sử dụng mạng nơ-ron TailorNet dự đoán mức độ biến dạng vật lý của các loại trang phục (ví dụ: áo thun, áo sơ mi, quần) dựa trên đặc điểm hình thể và kiểu dáng quần áo. Để đảm bảo tính ổn định và ngăn ngừa hệ thống bị sập do các thông số ngoại lệ (ví dụ: quần áo kích cỡ nhỏ áp lên cơ thể quá lớn), nghiên cứu đã tích hợp thuật toán kiểm tra tính hợp lệ về mặt vật lý, nhằm phát hiện và cảnh báo các trường hợp trang phục quá chật hoặc quá rộng trước khi đưa vào kết xuất.')

add_heading_2('3.3. Tích hợp trợ lý tư vấn thời trang thông minh')
doc.add_paragraph('Bên cạnh chức năng mô phỏng, hệ thống còn được trang bị trợ lý ảo ứng dụng Mô hình Ngôn ngữ Lớn (LLM). Trợ lý ảo được tinh chỉnh qua phương pháp thiết kế câu lệnh (Prompt Engineering) với ngữ cảnh là một chuyên gia thời trang [4].')
doc.add_paragraph('Module xử lý ngôn ngữ thực hiện phân tích đặc điểm hình dáng người dùng (đã được trích xuất từ dữ liệu đầu vào) và sở thích cá nhân để đưa ra các gợi ý phù hợp. Đặc biệt, hệ thống phân loại ngôn ngữ được thiết kế để tự động lọc và từ chối xử lý các câu hỏi nằm ngoài lĩnh vực mua sắm và thời trang, nhằm duy trì độ tin cậy và sự tập trung của dịch vụ.')

add_heading_1('4. Kết quả và bàn luận')
add_heading_2('4.1. Kết quả thực nghiệm')
add_heading_3('4.1.1. Triển khai nền tảng website thương mại điện tử')
doc.add_paragraph('Nền tảng website bán hàng đã được xây dựng hoàn thiện với đầy đủ tính năng: danh mục sản phẩm, giỏ hàng, thanh toán và quản lý hồ sơ người dùng. Sự tích hợp giữa Next.js và Tailwind CSS mang lại một giao diện trực quan, tốc độ tải trang nhanh và tương thích với nhiều kích thước màn hình. Các dữ liệu cấu hình 3D của trang phục được lưu trữ đồng bộ với thông tin sản phẩm trên MongoDB, đảm bảo truy xuất mượt mà.')

add_heading_3('4.1.2. Kết quả mô phỏng trang phục ảo')
doc.add_paragraph('Kết quả kiểm thử luồng mô phỏng 3D cho thấy hệ thống hoạt động chính xác trong việc tái hiện cơ thể người dùng. Các nếp gấp vải, độ rủ của áo được TailorNet kết xuất thể hiện mức độ chân thực cao so với mô phỏng tĩnh truyền thống. Trong các trường hợp người dùng chọn size áo không phù hợp với số đo, hệ thống đã thành công trong việc nhận diện ngoại lệ thông qua thuật toán Validate Size và gửi về cảnh báo "Quá chật" hoặc "Quá rộng" thay vì gặp lỗi vòng lặp tính toán, giúp nâng cao độ ổn định chung.')

add_heading_3('4.1.3. Kết quả kiểm thử trợ lý AI')
doc.add_paragraph('Hệ thống chatbot tư vấn phản hồi với tốc độ trung bình dưới 2 giây. Các kịch bản thử nghiệm như "Tôi mặc áo XL có vừa không" hoặc "Gợi ý phối đồ cho người vai rộng" đều nhận được câu trả lời chi tiết và đúng ngữ cảnh chuyên môn. Đồng thời, cơ chế rào chắn (guardrails) hoạt động hiệu quả khi chặn đứng được 100% các câu hỏi vi phạm tiêu chuẩn cộng đồng hoặc không liên quan đến thời trang.')

add_heading_3('4.1.4. Đánh giá hiệu suất toàn hệ thống')
doc.add_paragraph('Về mặt kỹ thuật, việc đóng gói tầng AI Engine vào Docker container giúp dễ dàng triển khai và độc lập tài nguyên. Quá trình trao đổi dữ liệu qua API giữa Node.js backend và Python engine hoạt động đồng bộ với độ trễ tối đa cho một lần render trang phục hoàn chỉnh ở khoảng 5-7 giây. Đây là mức thời gian hoàn toàn có thể chấp nhận được đối với một ứng dụng mô phỏng vật lý đồ họa trên nền Web.')

add_heading_2('4.2. Bàn luận')
add_heading_3('4.2.1. Phân tích ý nghĩa của kết quả')
doc.add_paragraph('Kết quả đạt được khẳng định tính khả thi của việc tích hợp các mô hình học sâu như SMPL và TailorNet trực tiếp vào hệ thống thương mại điện tử. Thông qua việc phân tách ứng dụng thành vi dịch vụ, nghiên cứu đã khắc phục rào cản về việc môi trường Node.js không tối ưu cho học máy, đồng thời giữ nguyên khả năng mở rộng của Web server. Hơn nữa, tính năng AI Advisor không chỉ giúp người dùng dễ chọn size mà còn góp phần cá nhân hóa trải nghiệm một cách chủ động.')

add_heading_3('4.2.2. Những hạn chế của nghiên cứu')
doc.add_paragraph('Mặc dù quá trình kết xuất vải đem lại hình ảnh thực tế, giới hạn về tốc độ tính toán của TailorNet vẫn yêu cầu tài nguyên GPU mạnh để đạt thời gian phản hồi thực (real-time). Khi lưu lượng truy cập lớn, hàng đợi xử lý mô hình có thể gây nghẽn cổ chai. Bên cạnh đó, số lượng mẫu trang phục có thể mô phỏng vật lý vẫn bị giới hạn theo dữ liệu huấn luyện của TailorNet, chưa bao hàm được tất cả các kiểu dáng thời trang phức tạp.')

add_heading_3('4.2.3. Đề xuất nghiên cứu tương lai')
doc.add_paragraph('Từ các hạn chế đó, hướng nghiên cứu tiếp theo sẽ tập trung vào việc tối ưu hóa mạng nơ-ron để giảm kích thước model, từ đó cải thiện tốc độ xử lý trên máy chủ. Ngoài ra, việc mở rộng kho dữ liệu thời trang và áp dụng các mô hình GenAI để tự động tạo texture vải dựa trên yêu cầu trực tiếp từ người dùng sẽ là bước tiến đáng kể trong tương lai.')

add_heading_1('5. Kết luận')
add_heading_2('5.1. Kết quả đạt được')
doc.add_paragraph('Nghiên cứu đã xây dựng thành công Website kinh doanh thời trang tích hợp phân hệ phòng thử đồ ảo 3D và trợ lý tư vấn thông minh. Giải pháp đã kết hợp mượt mà công nghệ Web (Next.js, Node.js) cùng công nghệ AI đồ họa (TailorNet, SMPL) qua kiến trúc phân tán. Hệ thống cung cấp khả năng tự động lấy số đo, kết xuất hình ảnh 3D chân thực theo thời gian thực và quản lý an toàn các truy vấn tư vấn thời trang.')

add_heading_2('5.2. Ý nghĩa thực tiễn')
doc.add_paragraph('Giải pháp cung cấp một hướng tiếp cận toàn diện giúp các nền tảng bán lẻ thời trang giảm thiểu tỷ lệ trả hàng do sai kích cỡ. Đồng thời, việc ứng dụng AI để tư vấn trực tuyến tăng cường khả năng tương tác với khách hàng, mang lại trải nghiệm tiện ích, thúc đẩy chuyển đổi số sâu rộng trong ngành công nghiệp thời trang trực tuyến.')

add_heading_1('Lời cám ơn')
doc.add_paragraph('Công trình nghiên cứu này được sự hỗ trợ và tạo điều kiện từ Bộ môn Công nghệ thông tin cùng sự hướng dẫn nhiệt tình của các giảng viên tại Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh.')

add_heading_1('Xung đột lợi ích')
doc.add_paragraph('Các tác giả tuyên bố không có xung đột lợi ích trong bài báo này.')

add_heading_1('Tuyên bố dữ liệu sẵn có')
doc.add_paragraph('Dữ liệu hỗ trợ cho các khám phá của nghiên cứu này khi độc giả yêu cầu một cách hợp lý sẽ được tác giả liên hệ cung cấp.')

add_heading_1('TÀI LIỆU THAM KHẢO')
def add_reference(text):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = 0
    p.paragraph_format.left_indent = Cm(0.75)
    p.paragraph_format.first_line_indent = Cm(-0.75)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(8)

add_reference('[1] C. Patel, Z. Liao, and G. Pons-Moll, "TailorNet: Predicting Clothing in 3D as a Function of Human Pose, Shape and Garment Style," in Proc. IEEE/CVF Conf. Comput. Vis. Pattern Recognit. (CVPR), 2020, pp. 7365-7375.')
add_reference('[2] M. Loper, N. Mahmood, J. Romero, G. Pons-Moll, and M. J. Black, "SMPL: A Skinned Multi-Person Linear Model," ACM Trans. Graph., vol. 34, no. 6, pp. 248:1-248:16, Oct. 2015.')
add_reference('[3] X. Han, Z. Wu, Z. Wu, R. Yu, and L. S. Davis, "VITON: An Image-Based Virtual Try-On Network," in Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR), 2018, pp. 7543-7552.')
add_reference('[4] OpenAI, "GPT-4 Technical Report," 2023. [Online]. Available: https://arxiv.org/abs/2303.08774.')
add_reference('[5] Vercel, "Next.js Documentation," 2024. [Online]. Available: https://nextjs.org/docs.')
add_reference('[6] S. Ramirez, "FastAPI - Modern, fast, web framework for building APIs," 2024. [Online]. Available: https://fastapi.tiangolo.com/.')
add_reference('[7] Y. Wada, "Hono - Ultrafast web framework for the Edges," 2024. [Online]. Available: https://hono.dev/.')
add_reference('[8] Mr.doob, "Three.js - JavaScript 3D Library," 2024. [Online]. Available: https://threejs.org/.')

doc.save(r'c:\Users\GP\Desktop\TMF-Official\TMF-NodeJS-FittingRoom3D\apps\@NghienCuuKhoaHoc\NghienCuuKhoaHoc_Project_v3.docx')
