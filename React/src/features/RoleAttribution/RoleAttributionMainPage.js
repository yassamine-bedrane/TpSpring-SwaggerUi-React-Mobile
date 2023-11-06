import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Table, Button } from 'antd';

const RoleAttributionsMainPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [roleAttributionsData, setRoleAttributionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/users');
                setRoleAttributionsData(response.data)
                return response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
                setIsError(true);
                return [];
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/roles');
                return response.data;
            } catch (error) {
                console.error('Error fetching roles:', error);
                setIsError(true);
                return [];
            }
        };

        fetchUsers()
            .then((data) => setUserOptions(data))
            .catch((error) => console.error('Error fetching users:', error));

        fetchRoles()
            .then((data) => setRoleOptions(data))
            .catch((error) => console.error('Error fetching roles:', error));
    }, []);

    const refreshTable = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/users');
            setRoleAttributionsData(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const assignRolesToUser = async () => {
        if (!selectedUser || selectedRoles.length === 0) {
            console.error('Please select a user and one or more roles.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8082/api/roles/assign-roles', {
                userId: selectedUser,
                roleIds: selectedRoles,
            });
            console.log('Roles assigned successfully:', response.data);
            refreshTable();

        } catch (error) {
            console.error('Error assigning roles:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Role Names',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => {
                if (roles && roles.length > 0) {
                    return (
                        <ul>
                            {roles.map((role) => (
                                <li key={role.id}>{role.name}</li>
                            ))}
                        </ul>
                    );
                } else {
                    return 'Aucun rôle attribué';
                }
            },
        },
    ];
    

    return (
        <div style={{ padding: '20px 90px' }}>
            <h1>ATTRIBUTION DE ROLES</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Select
                    style={{ width: 400, marginRight: '10px' }}
                    placeholder="Utilisateur"
                    value={selectedUser}
                    onChange={setSelectedUser}
                >
                    {userOptions.map((user) => (
                        <Select.Option key={user.id} value={user.id}>
                            {user.username}
                        </Select.Option>
                    ))}
                </Select>
                <Select
                    style={{ width: 400, marginRight: '10px' }}
                    placeholder="Roles"
                    value={selectedRoles}
                    mode="multiple"
                    onChange={setSelectedRoles}
                >
                    {roleOptions.map((role) => (
                        <Select.Option key={role.id} value={role.id}>
                            {role.name}
                        </Select.Option>
                    ))}
                </Select>
                <Button type="primary" onClick={assignRolesToUser}>
                    Assign Roles
                </Button>
            </div>
            <div>
                <Table
                    bordered
                    rowClassName={() => 'rowClassName1'}
                    dataSource={roleAttributionsData}
                    columns={columns}
                    loading={isLoading}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default RoleAttributionsMainPage;
