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
import AddRoleModal from './AddRoleModal';
import UpdateRoleModal from './UpdateRoleModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function RolesMainPage() {
    const [isAddRoleModalVisible, setIsAddRoleModalVisible] = useState(false);
    const [isUpdateRoleModalVisible, setIsUpdateRoleModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [globalSearchText, setGlobalSearchText] = useState('');

    const queryClient = useQueryClient();

    const { isLoading, isError, data: roles } = useQuery('roles', fetchRoles);

    async function fetchRoles() {
        try {
            const response = await axios.get('http://localhost:8082/api/roles');
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const columnsRoles = [
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
                        onClick={() => handleUpdateRole(record)}
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
                        onClick={() => handleDeleteRole(record)}
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
    const filteredRoles = globalSearchText
        ? roles.filter((role) =>
            Object.values(role).some((value) =>
                value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
            )
        )
        : roles;

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

    const handleShowAddModal = () => {
        setIsAddRoleModalVisible(true);
    };

    const handleCloseAddRoleModal = () => {
        setIsAddRoleModalVisible(false);
    };

    const handleShowUpdateRoleModal = () => {
        setIsUpdateRoleModalVisible(true);
    };

    const handleCloseUpdateRoleModal = () => {
        setIsUpdateRoleModalVisible(false);
    };

    const handleUpdateRole = (record) => {
        setSelectedRole(record);
        handleShowUpdateRoleModal();
    };

    const handleShowDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(true);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(false);
    };

    const handleDeleteRole = (record) => {
        setSelectedRole(record);
        handleShowDeleteConfirmationModal();
    };

    return (
        <div style={{ padding: '20px 130px' }}>
            <h1>ROLES</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button style={{ backgroundColor: '#588C7E', color: 'white' }} onClick={handleShowAddModal}>
                    <PlusCircleOutlined /> Ajouter un role
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
                        dataSource={filteredRoles}
                        columns={columnsRoles}
                        rowKey="id"
                        locale={{
                            emptyText: 'AUCUNE DONNEE',
                        }}
                    />
                </ConfigProvider>
            </div>
            <AddRoleModal
                isVisible={isAddRoleModalVisible}
                onClose={handleCloseAddRoleModal}
                onCancel={handleCloseAddRoleModal}
            ></AddRoleModal>
            <UpdateRoleModal
                isVisible={isUpdateRoleModalVisible}
                onClose={handleCloseUpdateRoleModal}
                onCancel={handleCloseUpdateRoleModal}
                initialData={selectedRole}

            ></UpdateRoleModal>

            <DeleteConfirmationModal
                isVisible={isConfirmationModalVisible}
                onClose={handleCloseDeleteConfirmationModal}
                onCancel={handleCloseDeleteConfirmationModal}
                role={selectedRole}
            ></DeleteConfirmationModal>

            <ToastContainer></ToastContainer>
        </div>
    );
}

export default RolesMainPage;
