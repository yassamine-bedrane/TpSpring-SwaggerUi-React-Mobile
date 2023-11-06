import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/style.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Select, ConfigProvider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import enUS from 'antd/lib/locale/en_US';
import AddStudentModal from './AddStudentModal';

function StudentsMainPage() {
    const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
    const [isUpdateStudentModalVisible, setIsUpdateStudentModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [globalSearchText, setGlobalSearchText] = useState('');

    const queryClient = useQueryClient();

    const { isLoading, isError, data: students } = useQuery('students', fetchStudents);

    async function fetchStudents() {
        try {
            const response = await axios.get('http://localhost:8082/api/student');
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const columnsStudents = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => renderHighlightedColumn(text),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Filiere',
            key: 'filiereLibelle',
            render: (record) => record.filiere && record.filiere.libelle,
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        style={{
                            backgroundColor: '#80BFB4',
                            borderColor: '#80BFB4',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleUpdateStudent(record)}
                    >
                        <EditOutlined /> Update
                    </Button>
                    <Button
                        style={{
                            backgroundColor: '#36594C',
                            borderColor: '#36594C',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleDeleteStudent(record)}
                    >
                        <DeleteOutlined /> Delete
                    </Button>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    // Global Search
    const filteredStudents = globalSearchText
        ? students.filter((student) =>
            Object.values(student).some((value) =>
                value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
            )
        )
        : students;

    const handleGlobalSearch = (e) => {
        setGlobalSearchText(e.target.value);
    };

    const renderHighlightedColumn = (text) => {
        if (globalSearchText) {
            return (
                <Highlighter
                    highlightStyle={{ backgroundColor: 'rgba(2, 166, 118, 0.6)', color: 'white', padding: 0 }}
                    searchWords={[globalSearchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            );
        }
        return text;
    };

    // Modal Related Functions
    const handleShowAddModal = () => {
        setIsAddStudentModalVisible(true);
    };

    const handleCloseAddStudentModal = () => {
        setIsAddStudentModalVisible(false);
    };

    const handleShowUpdateStudentModal = () => {
        setIsUpdateStudentModalVisible(true);
    };

    const handleCloseUpdateStudentModal = () => {
        setIsUpdateStudentModalVisible(false);
    };

    const handleUpdateStudent = (record) => {
        setSelectedStudent(record);
        handleShowUpdateStudentModal();
    };

    const handleShowDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(true);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(false);
    };

    const handleDeleteStudent = (record) => {
        setSelectedStudent(record);
        handleShowDeleteConfirmationModal();
    };

    return (
        <div style={{ padding: '20px 130px' }}>
            <h1>STUDENTS</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button style={{ backgroundColor: '#588C7E', color: 'white' }} onClick={handleShowAddModal}>
                    <PlusCircleOutlined /> Add a student
                </Button>
                <Input
                    placeholder="Search"
                    onChange={handleGlobalSearch}
                    prefix={<SearchOutlined />}
                    style={{ marginLeft: 10 }}
                />
            </div>
            <div>
                <ConfigProvider locale={enUS}>
                    <Table
                        dataSource={filteredStudents}
                        columns={columnsStudents}
                        rowKey="id"
                        locale={{
                            emptyText: 'AUCUNE DONNEE',
                        }}
                    />
                </ConfigProvider>
            </div>
            <AddStudentModal
                isVisible={isAddStudentModalVisible}
                onClose={handleCloseAddStudentModal}
                onCancel={handleCloseAddStudentModal}
            ></AddStudentModal>

            
           
            <ToastContainer></ToastContainer>
        </div>
    );
}

export default StudentsMainPage;
