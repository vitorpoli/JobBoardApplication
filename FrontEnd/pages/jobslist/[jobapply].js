import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { Button, TextField, Typography, CircularProgress, Box, Container } from '@mui/material';

function CreateButton({ onClick }) {
    return (
        <Button variant="contained" color="primary" onClick={onClick}>
            APPLY NOW
        </Button>
    );
}

export default function CreateJobApplication() {
    const router = useRouter();
    const { job_id } = router.query; 
    const [jobDetails, setJobDetails] = useState(null); 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedInUrl: '',
        salaryExpectation: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (!job_id) return; 

        const fetchJobDetails = async () => {
            setLoading(true); 
            try {
                const response = await fetch(`http://localhost:3001/api/jobs/${job_id}`);  
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJobDetails(data.data); 
            } catch (error) {
                console.error(error.message);
                setError('Failed to load job details.');
            } finally {
                setLoading(false); 
            }
        };

        fetchJobDetails();
    }, [job_id]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async () => {
        const { firstName, lastName, email, phone } = formData;

        if (!firstName || !lastName || !email || !phone) {
            setError('Please fill in all required fields.');
            return;
        }

        setError('');
        setLoading(true); 

        try {
            const response = await fetch('http://localhost:3001/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    job_id: job_id, 
                    linkedIn_url: formData.linkedInUrl,
                    salary_expectation: formData.salaryExpectation,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit application');
            }

            setIsSubmitted(true); 
        } catch (error) {
            console.error('Error submitting application:', error);
            setError(error.message);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: '10px' }}> 
            {isSubmitted ? (
                <Typography 
                    variant="h5" 
                    color="success.main" 
                    align="center" 
                    gutterBottom
                    sx={{ marginBottom: 10 }} 
                >
                    Your application was received successfully!
                </Typography>
            ) : (
                <>
                    {loading ? (
                        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                    ) : jobDetails ? (
                        <>
                            <Typography 
                                variant="h4" 
                                gutterBottom
                                sx={{
                                    textAlign: 'left', 
                                    marginBottom: 2, 
                                }}
                            >
                                {jobDetails.company_name}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                paragraph
                                sx={{
                                    textAlign: 'left', 
                                    marginBottom: 3, 
                                }}
                            >
                                {jobDetails.description}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1" color="error">
                            {error || 'Loading job details...'}
                        </Typography>
                    )}

                    <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ marginBottom: 2 }} 
                    >
                        Apply for this Job
                    </Typography>

                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard" 
                        sx={{ 
                            textAlign: 'left', 
                            marginBottom: 2, 
                        }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard" 
                        sx={{ 
                            textAlign: 'left', 
                            marginBottom: 2, 
                        }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard" 
                        sx={{ 
                            textAlign: 'left', 
                            marginBottom: 2, 
                        }}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard" 
                        sx={{ 
                            textAlign: 'left', 
                            marginBottom: 2, 
                        }}
                    />
                    <TextField
                        label="LinkedIn URL"
                        name="linkedInUrl"
                        type="url"
                        value={formData.linkedInUrl}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard" 
                        sx={{ 
                            textAlign: 'left', 
                            marginBottom: 2, 
                        }}
                    />
                    <TextField
                        label="Salary Expectation"
                        name="salaryExpectation"
                        type="number"
                        value={formData.salaryExpectation}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard" 
                        sx={{ 
                            textAlign: 'left', 
                            marginBottom: 3, 
                        }}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <CreateButton onClick={handleSubmit} />
                </>
            )}
        </Container>
    );
}
