import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStudentModal = ({ isVisible, onClose }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { TextArea } = Input;
    const [filieres, setFilieres] = useState([]);

    const fetchFilieres = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/v1/filieres');
            const data = await response.json();
            setFilieres(data);
        } catch (error) {
            throw error;
        }
    };

    const handleFormSubmit = async () => {
        // Your form submission code (POST request to add student)
        try {
            const formData = form.getFieldsValue();
            const response = await fetch('http://localhost:8082/api/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                queryClient.invalidateQueries('students');
                showToastMessage('Étudiant ajouté avec succès');
                onClose();
            } else {
                const data = await response.json();
                showToastMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            showToastMessage('Une erreur s\'est produite lors de l\'ajout de l\'étudiant', 'error');
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

    useEffect(() => {
        fetchFilieres(); // Call fetchFilieres when the component mounts
    }, []); // Empty dependency array ensures it's only called once on mount

    return (
        <Modal
            title="Ajouter un nouvel étudiant"
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
                <Form.Item name="username" label="Nom d'utilisateur">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Mot de passe">
                    <Input.Password />
                </Form.Item>
                <Form.Item name="name" label="Nom">
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email">
                    <Input />
                </Form.Item>
                <Form.Item name="filiere_id" label="Filiere">
                    <Select>
                        {filieres.map((filiere) => (
                            <Select.Option key={filiere.id} value={filiere.id}>
                                {filiere.libelle}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <ToastContainer />
        </Modal>
    );
};

export default AddStudentModal;
