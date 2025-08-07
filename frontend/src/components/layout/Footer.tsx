import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Column 1 */}
        <div>
          <h3 className="text-blue-600 font-bold mb-3 text-base">Chúng tôi là ai?</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="#" className="hover:underline">Về chúng tôi</a></li>
            <li><a href="#" className="hover:underline">Tham gia vào đội của chúng tôi</a></li>
            <li><a href="#" className="hover:underline">Liên hệ với chúng tôi</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:underline">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:underline">Cài đặt Cookie</a></li>
          </ul>
        </div>
        {/* Column 2 */}
        <div>
          <h3 className="text-blue-600 font-bold mb-3 text-base">Tài nguyên</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="#" className="hover:underline">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:underline">Cách hoạt động</a></li>
            <li><a href="#" className="hover:underline">Kế hoạch thành viên</a></li>
            <li><a href="#" className="hover:underline">Điểm nhấn</a></li>
            <li><a href="#" className="hover:underline">Sitemap</a></li>
          </ul>
        </div>
        {/* Column 3 */}
        <div>
          <h3 className="text-blue-600 font-bold mb-3 text-base">Tìm job freelance</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Python</li>
            <li>C#</li>
            <li>Nodejs, MongoDB</li>
            <li>Php, Laravel</li>
            <li>Web Development</li>
            <li>Ứng dụng di động</li>
            <li>ReactJs, VueJS</li>
            <li>HTML, CSS, Javascript</li>
          </ul>
        </div>
        {/* Column 4 */}
        <div>
          <h3 className="text-blue-600 font-bold mb-3 text-base">Tìm Developer (Khách hàng)</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Nodejs Developer</li>
            <li>C# Developer</li>
            <li>Web Developer</li>
            <li>Mobile App Developer</li>
            <li>Desktop App Developer</li>
            <li>Tools MMO</li>
            <li>ReactJS Developer</li>
            <li>Laravel Developer</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
        © 2025 - <a href="#" className="text-blue-600 font-medium hover:underline">Jinbaomin</a> Co., Ltd. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer; 