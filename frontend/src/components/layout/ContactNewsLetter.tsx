import React from "react";

const ContactNewsletter: React.FC = () => {
  return (
    <section className="w-full mb-7 py-16 flex flex-col items-center bg-white">
      {/* Newsletter badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-4 py-1 bg-blue-50 text-blue-600 rounded-full font-medium text-sm shadow-sm">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8" />
          </svg>
          Newsletter
        </span>
      </div>
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
        Nhận tin tức mới nhất về{" "}
        <span className="text-blue-500">cơ hội freelance</span>
      </h2>
      {/* Subtitle */}
      <p className="text-gray-500 text-center mb-8 max-w-xl">
        Đăng ký nhận thông báo về các dự án hot, tips kiếm tiền online và xu hướng công nghệ mới nhất
      </p>
      {/* Email form */}
      <div className="p-4 w-[55%] shadow-lg rounded-full bg-white">
        <form className="flex w-full outline-none max-w-2xl border border-gray-200 rounded-full mx-auto overflow-hidden">
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            className="flex-1 px-4 py-4 text-gray-700 bg-transparent outline-none rounded-full focus:inset-ring focus:inset-ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            Đăng ký ngay
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactNewsletter;