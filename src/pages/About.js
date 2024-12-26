import React from "react";

const About = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center px-6 py-10 sm:py-20">
      <div className="mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-wide">
          Chào mừng đến với{" "}
          <span className="text-yellow-400">MoiMoi - Translate</span>
        </h1>
        <p className="text-base sm:text-lg font-medium sm:w-3/4 mx-auto">
          MoiMoi - Translate là nền tảng dịch thuật đột phá giúp xóa bỏ rào cản
          ngôn ngữ và kết nối mọi người. Dù bạn đang học ngôn ngữ mới, du lịch
          hay giao tiếp xuyên văn hóa, chúng tôi sẽ đồng hành cùng bạn.
        </p>
        <p className="text-base sm:text-xl font-light mt-6 sm:w-3/4 mx-auto">
          Được tích hợp công nghệ AI tiên tiến, MoiMoi - Translate cung cấp dịch
          vụ dịch thuật nhanh chóng, chính xác cho văn bản, tài liệu và cả cuộc
          trò chuyện thời gian thực.
        </p>
        <p className="text-base sm:text-xl font-light mt-4 sm:w-3/4 mx-auto">
          Hãy gia nhập hàng triệu người dùng toàn cầu và trải nghiệm việc giao
          tiếp dễ dàng bất kể đâu!
        </p>
      </div>

      <div className="mt-12 sm:mt-16 flex flex-col items-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100">
          Kết nối với chúng tôi
        </h2>
        <div className="flex space-x-6 justify-center text-gray-200">
          <a
            href="#"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-facebook fa-2x sm:fa-3x hover:text-blue-600"></i>
          </a>
          <a
            href="#"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-twitter fa-2x sm:fa-3x hover:text-blue-400"></i>
          </a>
          <a
            href="#"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-instagram fa-2x sm:fa-3x hover:text-pink-600"></i>
          </a>
          <a
            href="#"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-linkedin fa-2x sm:fa-3x hover:text-blue-500"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
