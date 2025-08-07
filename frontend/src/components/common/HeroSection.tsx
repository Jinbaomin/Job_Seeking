import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useState } from "react";

export const HeroSection = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // console.log("Search:", searchQuery, selectedLocation)
    navigate(`/job?search=${searchQuery}&location=${selectedLocation}`)
  }

  return (
    <>
      {/* Enhanced Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden rounded-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          {/* <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          /> */}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Kết nối với
              <span className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
                &nbsp;các dự án IT&nbsp;
              </span>
              <br />
              hàng đầu tại Việt Nam
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Khám phá <span className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] bg-clip-text font-semibold">40.000+</span> cơ hội việc làm từ các công ty hàng đầu
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce hidden lg:block" />


      </div>

      {/* <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full"> */}
      <div className="w-full mt-5">
        {/* Enhanced Search Form */}
        <form onSubmit={handleSearch} className="max-w-[85%] mx-auto mb-12 px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Field */}
              {/* <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  DANH MỤC
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <select className="w-full pl-12 pr-10 py-4 text-gray-900 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all duration-200 appearance-none">
                    <option value="">Chọn lĩnh vực IT</option>
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Development</option>
                    <option value="fullstack">Full Stack Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="devops">DevOps</option>
                    <option value="data">Data Science</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div> */}

              {/* Skills Field */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  KỸ NĂNG
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="React, Vue.js, Laravel, Python..."
                    className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  ĐỊA ĐIỂM
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <select className="w-full pl-12 pr-10 py-4 text-gray-900 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all duration-200 appearance-none">
                    <option value="">Remote / Onsite</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:cursor-pointer flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Tìm ngay
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/job">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Khám phá việc làm
            </Button>
          </Link>
          <Link to="/company">
            <Button className="bg-transparent border-2 border-white/80 hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-200">
              Tìm hiểu công ty
            </Button>
          </Link>
        </div> */}
      </div>
    </>
  )
}