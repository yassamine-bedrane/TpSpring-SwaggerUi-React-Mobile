import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRoleModal = ({ isVisible, onClose }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { TextArea } = Input;
    const [roles, setRoles] = useState([]);


    const handleFormSubmit = async () => {
        // Your form submission code (POST request to add role)
        try {
            const formData = form.getFieldsValue();
            const response = await fetch('http://localhost:8082/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                queryClient.invalidateQueries('roles');
                showToastMessage('Role ajouté avec succès');
                onClose();
            } else {
                const data = await response.json();
                showToastMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error adding role:', error);
            showToastMessage('Une erreur s\'est produite lors de l\'ajout du role', 'error');
        }
    };

    const showToastMessage = (message, type = 'success') => {
        toast[type](message, {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Ajouter un nouveau role"
            visible={isVisible}
            onCancel={handleCancel}
            onOk={handleFormSubmit}
            okText="Confirmer"
            cancelText="Annuler"
            okButtonProps={{
                style: { backgroundColor: '#02A676', borderColor: '#02A676' },
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>
                </Form>
            <ToastContainer />
        </Modal>
    );
};

export default AddRoleModal;
