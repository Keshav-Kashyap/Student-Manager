import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import IDCard from "../components/StudentId/IDCard";
import { API_BASE } from "../config/api";
import { getHeaders } from "../services/studentService";
import SurajPrintingLoader from '../components/common/loader'
const AdminViewStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/students/view/${id}`, {
          headers: getHeaders(),
          credentials:"include"
        });
        const data = await res.json();
        if (data && data._id) {
          setStudent(data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) return<SurajPrintingLoader title="Students Finding..." />;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="group relative flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-out hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ArrowLeft 
              size={28} 
              className="mr-4 transform group-hover:-translate-x-2 transition-transform duration-300 relative z-10" 
            />
            <span className="relative z-10 text-xl tracking-wide">Back to List</span>
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition duration-300 animate-pulse"></div>
          </button>
        </div>
        
        <div className="flex justify-center">
          <IDCard student={student} />
        </div>
      </div>
    </div>
  );
};

export default AdminViewStudent;