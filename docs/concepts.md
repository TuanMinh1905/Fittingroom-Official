concepts.md : Lưu những khái niệm của riêng task đó. Ví dụ như v_teamplate là gì, v_shape là gì, middelware ở switch dog/cat là gì ?. Để khi nhìn lại có thể dễ search và hiểu workflow hơn

****Poster Slider của trang Home****
- Hỏi AI để nó trả lời : Giải thích cho tôi tư duy từng bước. Step by step mà bạn làm cái task này đi. Câu trả lời là bên dưới

# Work flow
Tức là bạn xếp tất cả poster vào một cái div cha. Mình gọi div này là divA. divA chứa flex. Và 4 poster này sẽ nằm theo hàng ngang bên trong divA

Do bạn chỉ set divA là w=1200px. Nên sau đó bạn overflow-hidden cái divA đi để nó ẩn đi 3 cái poster tràn ra bên ngoài. Chỉ hiển thị một cái bên trong div cha.

Sau đó khi ấn vào 2 button trái hoặc phải. Bạn sẽ bạn dùng translateX(-activeIndex * 100%) để di chuyển các poster vô khung hình divA


****Task A : Fitting Room****
- Phép tính : v_shaped = v_template + shapedirs @ betas là hàm forward(betas)  
- Search AI về kiểu dữ liệu của các loại v_template, shapedirs, face để hiểu nhanh cách code của hàm forward ở fole smpl_model ( Nó là cộng ma trận )


- Code cốt lõi Three.js
function makeGeometry(vertices: number[], faces: number[]) {
  ....
}


