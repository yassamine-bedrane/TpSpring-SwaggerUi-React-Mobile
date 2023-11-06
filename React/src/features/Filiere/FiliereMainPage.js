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
import AddFiliereModal from './AddFiliereModal';
import UpdateFiliereModal from './UpdateFiliereModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function FilieresMainPage() {
    const [isAddFiliereModalVisible, setIsAddFiliereModalVisible] = useState(false);
    const [isUpdateFiliereModalVisible, setIsUpdateFiliereModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [selectedFiliere, setSelectedFiliere] = useState(null);
    const [globalSearchText, setGlobalSearchText] = useState('');

    const queryClient = useQueryClient();

    const { isLoading, isError, data: filieres } = useQuery('filieres', fetchFilieres);

    async function fetchFilieres() {
        try {
            const response = await axios.get('http://localhost:8082/api/v1/filieres');
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const columnsFilieres = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => renderHighlightedColumn(text),
        },
        {
            title: 'Libellé',
            dataIndex: 'libelle',
            key: 'libelle',
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
                        onClick={() => handleUpdateFiliere(record)}
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
                        onClick={() => handleDeleteFiliere(record)}
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
    const filteredFilieres = globalSearchText
        ? filieres.filter((filiere) =>
            Object.values(filiere).some((value) =>
                value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
            )
        )
        : filieres;

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
        setIsAddFiliereModalVisible(true);
    };

    const handleCloseAddFiliereModal = () => {
        setIsAddFiliereModalVisible(false);
    };

    const handleShowUpdateFiliereModal = () => {
        setIsUpdateFiliereModalVisible(true);
    };

    const handleCloseUpdateFiliereModal = () => {
        setIsUpdateFiliereModalVisible(false);
    };

    const handleUpdateFiliere = (record) => {
        setSelectedFiliere(record);
        handleShowUpdateFiliereModal();
    };

    const handleShowDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(true);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(false);
    };

    const handleDeleteFiliere = (record) => {
        setSelectedFiliere(record);
        handleShowDeleteConfirmationModal();
    };

    return (
        <div style={{ padding: '20px 130px' }}>
            <h1>FILIERES</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button style={{ backgroundColor: '#588C7E', color: 'white' }} onClick={handleShowAddModal}>
                    <PlusCircleOutlined /> Ajouter une filiere
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
                        dataSource={filteredFilieres}
                        columns={columnsFilieres}
                        rowKey="id"
                        locale={{
                            emptyText: 'AUCUNE DONNEE',
                        }}
                    />
                </ConfigProvider>
            </div>
            <AddFiliereModal
                isVisible={isAddFiliereModalVisible}
                onClose={handleCloseAddFiliereModal}
                onCancel={handleCloseAddFiliereModal}
            ></AddFiliereModal>
            <UpdateFiliereModal
                isVisible={isUpdateFiliereModalVisible}
                onClose={handleCloseUpdateFiliereModal}
                onCancel={handleCloseUpdateFiliereModal}
                initialData={selectedFiliere}

            ></UpdateFiliereModal>

            <DeleteConfirmationModal
                isVisible={isConfirmationModalVisible}
                onClose={handleCloseDeleteConfirmationModal}
                onCancel={handleCloseDeleteConfirmationModal}
                filiere={selectedFiliere}
            ></DeleteConfirmationModal>

            <ToastContainer></ToastContainer>
        </div>
    );
}

export default FilieresMainPage;
