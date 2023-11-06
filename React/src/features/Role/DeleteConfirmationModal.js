import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';


const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, role }) => {
    const queryClient = useQueryClient();



    const showToastMessage = () => {
        toast.success('Role supprimé avec succès', {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };


    const handleFormSubmit = async () => {
        // Your form submission code (POST request to add role)
        try {
            const roleId = role.id;

            const response = await fetch(`http://localhost:8082/api/roles/${roleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                queryClient.invalidateQueries('roles');
                showToastMessage();
                onClose();
            } else {
                const data = await response.json();
                showToastMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting role:', error);
            showToastMessage('Une erreur s\'est produite lors de la suppression du role', 'error');
        }
    };

    const handleConfirm = async () => {

        try {
            handleFormSubmit();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Modal
            title="Confirmation"
            open={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Annuler
                </Button>,
                <Button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    key="confirm"
                    onClick={handleConfirm}
                >
                    Confirmer
                </Button>,
            ]}
        >
            Êtes-vous sûr(e) de vouloir supprimer ce role?
        </Modal>
    );








};

export default DeleteConfirmationModal;
