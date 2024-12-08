import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Box, TextareaAutosize, Typography } from '@mui/material';

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                onLoginSuccess(data.token);
            } else {
                setError(data.message || 'Failed to login');
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: 2,
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Login
            </Typography>
            {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
            
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Login
                </Button>
            </form>
        </Box>
    );
}

function CreateJobForm({ onSubmit, formData, handleChange }) {
    return (
        <Box sx={{ padding: 4 }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: '500px' }}>
                <Typography variant="h4" sx={{ marginBottom: 10 }}>
                    Create a New Job
                </Typography>

                <Typography variant="h6" sx={{ marginBottom: '15px' }}>
                     Company Name
                </Typography>

                <TextField
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    style={{
                        marginBottom: '40px',
                        fontSize: '16px',

                    }}

                />
                <Typography variant="h6" sx={{ marginBottom: '15px' }}>
                     Description
                </Typography>
                <TextareaAutosize
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    minRows={8}
                    style={{
                        width: '100%',
                        marginBottom: '40px',
                        border: 'none',
                        borderBottom: '1px solid',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '16px',
                        padding: '8px 4px',
                    }}
                />

                <Button
                    type="button"
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                >
                    Create
                </Button>
            </form>
        </Box>
    );
}

export default function CreateJob() {
    const [formData, setFormData] = useState({
        company_name: '',
        description: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/'); 
    };

    const handleSubmit = async () => {
        if (!formData.company_name || !formData.description) {
            setError('Please fill in all required fields.');
            return;
        }

        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    company_name: formData.company_name,
                    description: formData.description,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create job');
            }

            const data = await response.json();
            setSuccessMessage('Job created successfully!');
            setFormData({
                company_name: '',
                description: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {isLoggedIn ? (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogout}
                        sx={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                        }}
                    >
                        Logout
                    </Button>

                    <CreateJobForm
                        onSubmit={handleSubmit}
                        formData={formData}
                        handleChange={handleChange}
                    />

                    {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
                    {successMessage && <Typography color="success" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
                </>
            ) : (
                <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
        </Box>
    );
}




