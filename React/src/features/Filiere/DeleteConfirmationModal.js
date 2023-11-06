import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';


const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, filiere }) => {
    const queryClient = useQueryClient();



    const showToastMessage = () => {
        toast.success('Filière supprimée avec succès', {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };


    const handleFormSubmit = async () => {
        // Your form submission code (POST request to add filiere)
        try {
            const filiereId = filiere.id;

            const response = await fetch(`http://localhost:8082/api/v1/filieres/${filiereId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                queryClient.invalidateQueries('filieres');
                showToastMessage('Filière supprimée avec succès');
                onClose();
            } else {
                const data = await response.json();
                showToastMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting filiere:', error);
            showToastMessage('Une erreur s\'est produite lors de la suppression de la filière', 'error');
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
            Êtes-vous sûr(e) de vouloir supprimer cette filière?
        </Modal>
    );








};

export default DeleteConfirmationModal;
