import React from 'react';
import { Link } from 'react-router-dom';

interface Company {
  _id: string;
  name: string;
  address: string;
  description: string;
  logo?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  deletedBy?: {
    _id: string;
    email: string;
  };
}

export interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Link to={`/company/${company._id}`} className="block">
      <div className="border rounded-lg p-6 shadow hover:shadow-lg transition cursor-pointer bg-white">
        <div className="flex items-start gap-4">
          {company.logo && (
            <img 
              src={company.logo} 
              alt={company.name} 
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-700 mb-2">{company.name}</h3>
            <div className="text-sm text-gray-600 mb-2">
              📍 {company.address}
            </div>
            <p className="text-gray-700 mb-3 line-clamp-2">
              {company.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Thành lập: {formatDate(company.createdAt)}</span>
              {company.isDeleted && (
                <span className="text-red-500">Đã xóa</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard; 