// Lý do tách 3 cái component Section1, Section2, Section3 : 
// Giữ page.tsx làm server/container để tận dụng SSR, còn phần nhập liệu tương tác thì tách ra một component con client riêng ( vì cần sử dụng useclient ).
// Cách này giúp page nhẹ hơn, vẫn có SSR cho render ban đầu, nhưng các slider/input/debounce vẫn hoạt động bình thường ở client.

type BigSection3Props = { // component nhận className, kiểu string, và ? nghĩa là không bắt buộc.
  className?: string;
};

export default function BigSection3({ className = "" }: BigSection3Props) {
  return (
    <section className={className}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Section 3</h2>
        <p className="text-sm text-gray-600">Hãy nhập thông số cơ thể bạn</p>
      </div>
    </section>
   );
}
