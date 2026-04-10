import { createContext, useEffect, useState } from "react";
import * as studentService from "../services/studentService";

export const StudentsContext = createContext();

const DEFAULT_LIMIT = 10;

const normalizeStudentsResponse = (payload, fallbackPage, fallbackLimit) => {
    if (Array.isArray(payload)) {
        return {
            students: payload,
            currentPage: fallbackPage,
            totalPages: 1,
            totalStudents: payload.length,
            limit: fallbackLimit,
        };
    }

    const students = payload?.data || payload?.students || payload?.items || payload?.docs || [];
    const pagination = payload?.pagination || payload?.meta || {};

    const currentPage = Number(
        pagination.page ?? payload?.currentPage ?? payload?.page ?? fallbackPage
    ) || 1;
    const limit = Number(pagination.limit ?? payload?.limit ?? fallbackLimit) || fallbackLimit;
    const totalStudents = Number(
        pagination.total ?? payload?.totalCount ?? payload?.total ?? students.length
    ) || students.length;
    const totalPages = Number(
        pagination.totalPages ?? payload?.totalPages ?? Math.max(1, Math.ceil(totalStudents / limit))
    ) || 1;

    return {
        students,
        currentPage,
        totalPages,
        totalStudents,
        limit,
    };
};

export const StudentsProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);

    const fetchStudents = async (page = currentPage, pageLimit = limit) => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentService.fetchStudents(page, pageLimit);
            const normalized = normalizeStudentsResponse(data, page, pageLimit);

            setStudents(normalized.students);
            setCurrentPage(normalized.currentPage);
            setLimit(normalized.limit);
            setTotalPages(normalized.totalPages);
            setTotalStudents(normalized.totalStudents);

            return normalized;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (studentId) => {
        await studentService.deleteStudent(studentId);
        setStudents(prev => prev.filter(s => s._id !== studentId));
        setTotalStudents(prev => {
            const nextTotal = Math.max(0, prev - 1);
            const nextPages = Math.max(1, Math.ceil(nextTotal / limit));
            setTotalPages(nextPages);
            setCurrentPage(prevPage => Math.min(prevPage, nextPages));
            return nextTotal;
        });
        return { success: true };
    };

    const deleteMultipleStudents = async (studentIds = []) => {
        await studentService.deleteMultipleStudents(studentIds);
        const idsSet = new Set(studentIds);
        setStudents(prev => prev.filter(s => !idsSet.has(s._id)));
        setTotalStudents(prev => {
            const nextTotal = Math.max(0, prev - studentIds.length);
            const nextPages = Math.max(1, Math.ceil(nextTotal / limit));
            setTotalPages(nextPages);
            setCurrentPage(prevPage => Math.min(prevPage, nextPages));
            return nextTotal;
        });
        return { success: true };
    };

    useEffect(() => {
        fetchStudents(1, DEFAULT_LIMIT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StudentsContext.Provider
            value={{
                students,
                loading,
                error,
                fetchStudents,
                deleteStudent,
                deleteMultipleStudents,
                setStudents,
                currentPage,
                totalPages,
                totalStudents,
                limit,
                setCurrentPage,
            }}
        >
            {children}
        </StudentsContext.Provider>
    );
};